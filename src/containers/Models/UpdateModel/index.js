import React from "react";
import ModelForm from "../ModelForm";

const UpdateModel = () => {
  return (
    <div>
      <h1 className="font-bold">EDIT MODEL</h1>
      <ModelForm
        isUpdate={true}
        data={{
          modelName: "Model RAM",
          productName: ["RAM 16I"],
          query: "select * from Products where ProductType='RAM'",
        }}
      />
    </div>
  );
};

export default UpdateModel;
