import React from "react";
import { Validation } from "../models/validations";

type ErrorMessageProps = {
    rules?: Validation[]
}

const ErrorMessage = (props: ErrorMessageProps) => {
    const errorMessage = props.rules?.find(x => x.isValid === false && x.message)?.message;

    return <>
        {errorMessage ?
            <>
                {typeof(errorMessage) == "string" ?
                    <div className="error-message">{errorMessage}</div>
                    :
                    errorMessage
                }
            </>
            :
            null
        }
    </>
}

export default ErrorMessage;