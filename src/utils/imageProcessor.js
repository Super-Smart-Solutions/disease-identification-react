import EXIF from "exif-js";
import pica from "pica";

export async function preprocessImage(file) {
    const img = await loadImage(file);

    const orientation = await getOrientation(file);

    const correctedCanvas = applyOrientation(img, orientation);

    const resizedCanvas = await resizeTo250(correctedCanvas);

    const finalBlob = await canvasToJPEG(resizedCanvas);

    return new File([finalBlob], "processed.jpg", { type: "image/jpeg" });
}

function loadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                resolve(img);
            };
            img.onerror = (err) => {
                console.error("[Preprocess] Image load error:", err);
                reject(err);
            };
            img.src = reader.result;
        };
        reader.onerror = (err) => {
            console.error("[Preprocess] FileReader error:", err);
            reject(err);
        };
        reader.readAsDataURL(file);
    });
}

function getOrientation(file) {
    return new Promise((resolve) => {
        let resolved = false;

        EXIF.getData(file, function () {
            const orientation = EXIF.getTag(this, "Orientation") || 1;
            resolved = true;
            resolve(orientation);
        });

        // Fallback in case EXIF.getData never calls the callback
        setTimeout(() => {
            if (!resolved) {
                console.warn("[Preprocess] EXIF.getData did not resolve in time. Falling back to 1.");
                resolve(1); // Default orientation
            }
        }, 1000); // 1 second timeout
    });
}


function applyOrientation(img, orientation) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const width = img.width;
    const height = img.height;

    canvas.width = width;
    canvas.height = height;

    // ⚠️ You can add switch-case to handle all orientations
    ctx.drawImage(img, 0, 0);

    return canvas;
}

async function resizeTo250(canvas) {
    const picaInstance = pica();
    const target = document.createElement("canvas");
    target.width = 250;
    target.height = 250;

    await picaInstance.resize(canvas, target, { quality: 3 });
    return target;
}

function canvasToJPEG(canvas) {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, "image/jpeg", 0.9);
    });
}
