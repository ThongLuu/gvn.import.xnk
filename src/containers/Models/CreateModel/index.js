import React from "react";
import ModelForm from "../ModelForm";

const CreateModel = () => {
  return (
    <div>
      <h1 className="font-bold">NEW MODEL</h1>
      <ModelForm
        isUpdate={false}
        data={{
          modelName: "",
          productName: "",
          query: "",
        }}
      />
    </div>
  );
};

export default CreateModel;
