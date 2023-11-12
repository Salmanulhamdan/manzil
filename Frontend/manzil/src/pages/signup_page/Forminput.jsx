import React, { useRef } from "react";

const FormInput = (props) => {
  const { label, errorMessage, onChange, id, ...inputProps } = props;

  return (
    <div className="mt-2">
      <label className="text-lg font-medium">
        {label}
      </label>
      <input
        className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
        {...inputProps}
        onChange={onChange}
      />
    </div>
  );
};

export default FormInput;