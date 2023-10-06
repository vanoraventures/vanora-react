import React, { useCallback, useEffect } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useVanoraStore } from "../../../core";

type Props = {
    /**
    * Google Recaptcha Site Key
    */
    siteKey: string
}

/**
 * Use this component only once. Multiple uses can cause multiple recaptcha downloads.
 */
const Recaptcha = (props: Props) => {
    return (
        <GoogleReCaptchaProvider reCaptchaKey={props.siteKey}>
            <Captcha />
        </GoogleReCaptchaProvider>
    )
}

const Captcha = () => {
    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleReCaptchaVerify = useCallback(async () => {
        if (!executeRecaptcha) {
            return;
        }

        useVanoraStore.setState(state => {
            return { ...state, getRecaptchaToken: async () => { return await executeRecaptcha(); } }
        })
    }, [executeRecaptcha]);

    useEffect(() => {
        handleReCaptchaVerify();
    }, [handleReCaptchaVerify]);

    return <></>;
}

export default Recaptcha;