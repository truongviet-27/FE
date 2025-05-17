import React from "react";
import { useFormContext } from "react-hook-form";

function RenderInput({ type, name, label, registerProps, errorMessage }) {
    const { register } = useFormContext();
    return (
        <div className="form-outline mb-4 position-relative">
            <input
                type={type}
                id={name}
                className="form-control form-control-lg !text-[15px]"
                {...register(name, registerProps)}
            />
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}

export default RenderInput;
