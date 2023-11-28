import {
  H3,
  Layout,
  overrideColorTheme,
  fieldsRegistryService,
  userRegistryService,
  Loading,
} from "@shiksha/common-lib";
import React, { useCallback, useEffect, useState } from "react";
import manifest from "../manifest.json";
import { useTranslation } from "react-i18next";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { Box, Container, useToast } from "native-base";
import { useLocation, useNavigate } from "react-router-dom";

let schema = {
  title: "Add Users",
  type: "object",
  required: ["username", "name", "role", "password"],
  properties: {
    username: { type: "string", title: "Username", default: "" },
    name: { type: "string", title: "Name", default: "" },
    role: {
      type: "string",
      title: "Role",
      default: "",
      oneOf: [
        {
          title: "Facilitator",
          enum: ["facilitator"],
        },
        {
          title: "Beneficiary",
          enum: ["beneficiary"],
        },
        {
          title: "System Admin",
          enum: ["systemAdmin"],
        },
        {
          title: "Student",
          enum: ["student"],
        },
        {
          title: "Teacher",
          enum: ["teacher"],
        },
        {
          title: "Mentor",
          enum: ["mentor"],
        },
      ],
    },
    password: { type: "string", title: "Password", default: "" },
    email: { type: "string", title: "Email", default: "" },
  },
};

let uiSchema = {
  name: {
    "ui:classNames": "custom-class-name",
    "ui:placeholder": "",
  },
  password: {
    "ui:widget": "password",
  },
};

function CreateUser({ footerLinks, appName }) {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formSchema, setFormSchema] = useState({
    schema: schema,
    uiSchema: uiSchema,
  });
  const [fields, setFields] = useState([]);
  const [fieldResponse, setFieldResponse] = useState({});
  const [isEditForm, setIsEditForm] = useState(false);
  const [loading, isLoading] = useState(true);
  const { state } = useLocation();
  useEffect(() => {
    fieldsRegistryService
      .getFields(
        {
          limit: "",
          page: 0,
          filters: {
            contextId: { _is_null: true },
            context: { _eq: "Users" },
          },
        },
        {
          tenantid: process.env.REACT_APP_TENANT_ID,
        }
      )
      .then((response) => {
        console.log("response", response);
        let extraFields = [];
        let fieldRes = {};
        response.forEach((field) => {
          if (field.render) {
            extraFields.push(JSON.parse(field.render));
            fieldRes[field.name] = field;
          }
        });
        setFields(extraFields);
        setFieldResponse(fieldRes);
        if (state) {
          setFormData((prev) => {
            return { ...prev, ...state };
          });
          setIsEditForm(true);
        }
        isLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log("Fields", fields);
    createFormSchema();
  }, [fields]);

  const createFormSchema = () => {
    fields.forEach((renderJSON) => {
      for (const key in renderJSON) {
        const field = renderJSON[key];
        setFormSchema((prev) => ({
          ...prev,
          schema: {
            ...prev.schema,
            properties: {
              ...prev.schema.properties,
              [key]: field.coreSchema,
            },
            required: field.hasOwnProperty("required")
              ? [...prev.schema.required, key]
              : [...prev.schema.required],
          },
          uiSchema: {
            ...prev.uiSchema,
            [key]: field.uiSchema,
          },
        }));
      }
    });
    console.log("formSchema", formSchema);
    setShowForm(true);
  };

  const log = (type) => console.log.bind(console, type);
  const handleChange = useCallback((event) => {
    console.log(event);
    setFormData((prev) => {
      return { ...prev, ...event };
    });
  });

  const handleSubmit = (data) => {
    const fieldKeys = fields.map((obj) => Object.keys(obj)[0]);
    let corePayload = {};
    let fieldsPayload = "";
    for (let key in data) {
      if (fieldKeys.includes(key)) {
        let customFieldValueKey = fieldResponse[key].fieldId;
        if (data.fields?.length) {
          const extractedField = data.fields.find(item => item.name === key);
          if (extractedField?.fieldValues?.length) {
            customFieldValueKey = extractedField.fieldValues[0].fieldValuesId;
          }
          // delete data.fields;
        }

        if (fieldsPayload === "") {
          fieldsPayload = `${customFieldValueKey}:${data[key]}`;
        } else {
          fieldsPayload = `${fieldsPayload}|${customFieldValueKey}:${data[key]}`;
        }
      } else {
        corePayload[key] = data[key];
      }
    }
    // corePayload["password"] = data["password"];
    corePayload["fieldValues"] = fieldsPayload;
    delete corePayload["fields"]; //todo: optimize this

    if (isEditForm) {
      userRegistryService
        .update(corePayload, {
          tenantid: process.env.REACT_APP_TENANT_ID,
        })
        .then((response) => {
          console.log("response", response);
          if (!toast.isActive("user-updated")) {
            toast.show({
              id: "user-updated",
              title: t("USER_UPDATED_SUCCESSFULLY"),
            });
          }
          navigate("/admin");
        });
    } else {
      userRegistryService
        .create(corePayload, {
          tenantid: process.env.REACT_APP_TENANT_ID,
        })
        .then((response) => {
          console.log("response", response);
          if (!toast.isActive("user-created")) {
            toast.show({
              id: "user-created",
              title: t("USER_CREATED_SUCCESSFULLY"),
            });
          }
          navigate("/admin");
        });
    }
  };
  const colors = overrideColorTheme();

  if (loading) {
    return <Loading message={t("LOADING")} />;
  }

  return (
    <Layout
      _header={{
        title: t("CREATE_NEW_USER"),
      }}
      _appBar={{ languages: manifest.languages }}
      subHeader={
        <H3 textTransform="none">{t("SUBMIT_FORM")}</H3>
      }
      _subHeader={{
        bg: colors?.cardBg,
        _text: {
          fontSize: "16px",
          fontWeight: "600",
          textTransform: "inherit",
        },
      }}
      _footer={footerLinks}
    >
      {showForm && (
        <Box m={"30px"}>
          <Form
            schema={formSchema.schema}
            uiSchema={formSchema.uiSchema}
            validator={validator}
            formData={formData}
            onChange={(e) => handleChange(e.formData)}
            onSubmit={(e) => handleSubmit(e.formData)}
            onError={log("errors")}
            showErrorList={false}
          />
        </Box>
      )}
    </Layout>
  );
}

export default CreateUser;
