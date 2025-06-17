import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { generateVerificationCode, verifyCode } from './../api/verificationAPI';
import { uploadUserAvatar } from "./../api/userAPI";
import { registerUser } from './../api/authAPI';
import { acceptInvitationWithToken } from "../api/inviteApi";

const useRegisterLogic = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        email: "",
        password: "",
        re_password: "",
        phone_number: "",
        is_active: true,
        is_superuser: true,
        is_verified: true,
        organization_id: 0,
        first_name: "",
        last_name: "",
        user_type: "individual",
        token: null,
        city: "",
        invite_id: null
    });
    const [step, setStep] = useState(1);
    const [otpModal, setOtpModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [tempSelectedFile, setTempSelectedFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [scale, setScale] = useState(1.2);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [invited, setInvited] = useState(false);

    // Handle prefilled email from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const email = params.get("email");
        const invite_id = params.get("invite_id");
        if (email) {
            setRegisterData((prev) => ({ ...prev, email }));
            setRegisterData((prev) => ({ ...prev, invite_id }));
            setInvited(true)
        }
    }, [location.search]);

    // Validation for Step 1
    const validateStepOne = (values) => {
        const errors = {};
        if (!values.first_name) errors.first_name = t("first_name_required_key");
        if (!values.last_name) errors.last_name = t("last_name_required_key");
        if (!values.user_type) errors.user_type = t("user_type_required_key");
        return errors;
    };

    // Validation for Step 2
    const validateStepTwo = (values) => {
        const errors = {};
        if (!values.email) {
            errors.email = t("email_required_key");
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = t("email_invalid_key");
        }
        if (!values.password) {
            errors.password = t("password_required_key");
        } else if (values.password.length < 8) {
            errors.password = t("password_min_length_key");
        }
        if (!values.re_password) {
            errors.re_password = t("re_password_required_key");
        } else if (values.re_password !== values.password) {
            errors.re_password = t("passwords_do_not_match_key");
        }
        if (!values.phone_number) {
            errors.phone_number = t("phone_number_required_key");
        } else if (!/^\d+$/.test(values.phone_number)) {
            errors.phone_number = t("phone_number_invalid_key");
        }
        return errors;
    };

    // Handle step navigation
    const handleStepClick = (newStep) => {
        if (newStep < step) {
            setStep(newStep);
            return true;
        }
        if (step === 1 && Object.keys(validateStepOne(registerData)).length === 0) {
            setStep(newStep);
            return true;
        }
        if (step === 2 && Object.keys(validateStepTwo(registerData)).length === 0) {
            setStep(newStep);
            return true;
        }
        if (step === 3) {
            setStep(newStep);
            return true;
        }
        return false;
    };

    // Step 1 form submission
    const handleStepOneSubmit = (values) => {
        setRegisterData((prev) => ({ ...prev, ...values }));
        setStep(2)
    };

    // Step 2 form submission
    const handleStepTwoSubmit = async (values) => {
        setIsLoading(true);
        setRegisterData((prev) => ({ ...prev, ...values }));
        const payload = {
            first_name: registerData.first_name,
            last_name: registerData.last_name,
            phone_number: values.phone_number,
            email: values.email,
            password: values.password,
            city: values.city,
            organization_id: null,
        };
        try {
            await registerUser(payload);
            await generateVerificationCode(payload.email);
            setOtpModal(true);
        } catch (error) {
            console.error("Error in Step 2:", error);
            setError(error.message || t("registration_error"));
        }
        finally {
            setIsLoading(false);
        }
    };

    // OTP submission
    const handleOTPSubmit = async (otp) => {
        try {
            const response = await verifyCode(registerData.email, otp);
            setRegisterData((prev) => ({ ...prev, token: response.access_token }));
            setOtpModal(false);

            if (invited) {
                await acceptInvitationWithToken(registerData?.invite_id, response.access_token);
            }

            setStep(3);
        } catch (error) {
            console.error("OTP verification failed:", error);
            setError(error.message || t("otp_verification_error"));
        }
    };

    // Avatar handling
    const handleFileSelect = (files) => {
        if (files.length > 0) {
            setTempSelectedFile(files[0]);
            setSelectedFile(files[0]);
            setShowModal(true);
            setError(null);
        }
    };

    const handleAvatarSave = async (editorRef) => {
        if (!editorRef.current || isLoading) return;
        setIsLoading(true);
        setError(null);

        try {
            const canvas = editorRef.current.getImageScaledToCanvas();
            const blob = await new Promise((resolve) => {
                canvas.toBlob((blob) => resolve(blob), "image/png", 1);
            });

            if (!blob) throw new Error(t("avatar_upload_failed"));

            const file = new File([blob], "avatar.png", {
                type: "image/png",
                lastModified: Date.now(),
            });

            await uploadUserAvatar(file, registerData.token);
            setSelectedFile(file);
            setShowModal(false);
            toast.success(t("account_created_successfully"));
            navigate("/auth/login");
        } catch (error) {
            console.error("Error saving avatar:", error);
            setError(error.message || t("avatar_upload_error"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkipAvatar = () => {
        toast.success(t("account_created_successfully"));
        navigate("/auth/login");
    };

    return {
        registerData,
        setRegisterData,
        step,
        setStep,
        otpModal,
        setOtpModal,
        selectedFile,
        setSelectedFile,
        tempSelectedFile,
        setTempSelectedFile,
        showModal,
        setShowModal,
        scale,
        setScale,
        isLoading,
        setIsLoading,
        error,
        setError,
        validateStepOne,
        validateStepTwo,
        handleStepClick,
        handleStepOneSubmit,
        handleStepTwoSubmit,
        handleOTPSubmit,
        handleFileSelect,
        handleAvatarSave,
        handleSkipAvatar,
        invited,
        t,
    };
};

export default useRegisterLogic;