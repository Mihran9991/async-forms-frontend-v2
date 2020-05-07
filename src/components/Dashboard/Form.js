import React from "react";
import { withRouter } from "react-router-dom";
import { Divider } from "antd";
import get from "lodash/get";

import FormInstance from "./FormInstance";

function Form(props) {
  const { instanceData } = get(props, "location.state", {
    instanceData: {
      name: "",
      structure: {},
      title: "",
      formId: "",
      instanceId: "",
    },
  });

  return (
    <>
      <FormInstance data={instanceData} />
      <Divider className="divider" />
    </>
  );
}

export default withRouter(Form);
