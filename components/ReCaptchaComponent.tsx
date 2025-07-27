"use client";

import { forwardRef } from "react";

interface ReCaptchaComponentProps {
  sitekey: string;
  onChange: (token: string | null) => void;
  onExpired: () => void;
}

const ReCaptchaComponent = forwardRef<any, ReCaptchaComponentProps>(
  ({ sitekey, onChange, onExpired }, ref) => {
    // @ts-ignore
    const ReCAPTCHA = require("react-google-recaptcha");
    return (
      <ReCAPTCHA
        ref={ref}
        sitekey={sitekey}
        onChange={onChange}
        onExpired={onExpired}
      />
    );
  }
);

ReCaptchaComponent.displayName = "ReCaptchaComponent";

export default ReCaptchaComponent;
