import React from "react";
import {
  Text,
  Pressable,
  Image,
  Avatar,
  Stack,
  VStack,
  Heading,
  HStack,
  Center,
  Button,
  ArrowDownIcon,
  ArrowUpIcon,
} from "native-base";
import { useTranslation } from "react-i18next";
import {
  capture,
  Layout,
  overrideColorTheme,
  Widget,
  cohortRegistryService,
  Loading,
} from "@shiksha/common-lib";
import moment from "moment";
import manifest from "../manifest.json";
import { useParams } from "react-router-dom";
import Collapse from "@mui/material/Collapse";

const colors = overrideColorTheme();
const SelfAttendanceSheet = React.lazy(() =>
  import("profile/SelfAttendanceSheet")
);

const CohortDetails = ({ footerLinks, setAlert, appName }) => {
  const { t } = useTranslation();
  const [selfAttendance, setSelfAttendance] = React.useState({});
  const [showModal, setShowModal] = React.useState(false);
  const [cohortDetails, setCohortDetails] = React.useState({});
  const [toggleDetails, setToggleDetails] = React.useState(true);
  const [fields, setFields] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  let newAvatar = localStorage.getItem("firstName");
  const [userId, setUserId] = React.useState();
  const { cohortId } = useParams();

  let cameraUrl = "";
  let avatarUrlObject = cameraUrl
    ? {
        source: {
          uri: cameraUrl,
        },
      }
    : {};
  const widgetData = [
    {
      data: [
        {
          title: t("Mark My Attendance"),
          //link: "/classes",
          icon: "ParentLineIcon",
          _box: {
            bg: "widgetColor.500",
          },
          _icon: {
            color: "iconColor.500",
          },
          _text: { color: "warmGray.700" },
        },
      ],
    },
    {
      data: [
        {
          title: t("View Students"),
          link: `/cohorts/${cohortId}/students`,
          icon: "ParentLineIcon",
          _box: {
            bg: "widgetColor.600",
          },
          _icon: {
            color: "iconColor.600",
          },
          _text: { color: "warmGray.700" },
        },
      ],
    },
    // commented the below code (not required for OBLF for now)
    // {
    //   data: [
    //     {
    //       title: t("Class Digital Observation"),
    //       link: "/classes",
    //       icon: "ParentLineIcon",
    //       _box: {
    //         bg: "widgetColor.700",
    //       },
    //       _icon: {
    //         color: "iconColor.700",
    //       },
    //       _text: { color: "warmGray.700" },
    //     },
    //   ],
    // },
    // {
    //   data: [
    //     {
    //       title: t("Class Phygital Assessment"),
    //       link: "/classes",
    //       icon: "ParentLineIcon",
    //       _box: {
    //         bg: "widgetColor.800",
    //       },
    //       _icon: {
    //         color: "iconColor.800",
    //       },
    //       _text: { color: "warmGray.700" },
    //     },
    //   ],
    // },
    // {
    //   data: [
    //     {
    //       title: t("View Class Reports"),
    //       link: "/classes",
    //       icon: "ParentLineIcon",
    //       _box: {
    //         bg: "widgetColor.1000",
    //       },
    //       _icon: {
    //         color: "iconColor.1000",
    //       },
    //       _text: { color: "warmGray.700" },
    //     },
    //   ],
    // },
  ];

  const getFieldValues = (cohortsFields) => {
    let fieldVals = [];
    cohortsFields.map((item) => {
      if (item.fieldValues.length) {
        let fieldValue = item.fieldValues[0];
        if (item.fieldValues.length > 1) {
          fieldValue = item.fieldValues.map((field) => field.value).join(", ");
        }
        fieldVals = [
          ...fieldVals,
          { label: item.label, values: fieldValue.value },
        ];
      }
    });
    setFields(fieldVals);
  };

  const handleToggleDetails = () => {
    setToggleDetails(!toggleDetails);
  };

  const handleOnPress = () => {
    setUserId(userId);
    setShowModal(true);
  };

  React.useEffect(() => {
    const getData = async () => {
      const result = await cohortRegistryService.getCohortDetails(
        {
          cohortId: cohortId,
        },
        {
          tenantid: process.env.REACT_APP_TENANT_ID,
        }
      );

      if (result.length) {
        setCohortDetails(result[0]);
        if (result[0].fields) {
          getFieldValues(result[0].fields);
          setSelfAttendance(result[0]);
        }
      }
      setLoading(false);
    };
    getData();
    capture("PAGE");
  }, [cohortId]);

  if (loading) {
    return <Loading />;
  } else {
    return (
      <SelfAttendanceSheet
        {...{
          showModal,
          setShowModal,
          setAttendance: setSelfAttendance,
          appName,
          userId,
          setUserId,
        }}
      >
        <Layout
          _header={{
            title: cohortDetails?.name,
            subHeading: moment().format("hh:mm A"),
            iconComponent: (
              <Pressable>
                {cameraUrl ? (
                  <Image
                    ref={myRef}
                    {...avatarUrlObject}
                    rounded="lg"
                    alt="Profile"
                    size="50px"
                  />
                ) : (
                  <Avatar>{newAvatar?.toUpperCase().substr(0, 2)}</Avatar>
                )}
              </Pressable>
            ),
          }}
          _appBar={{ languages: manifest.languages }}
          // subHeader={<H3 textTransform="none">{t("THE_CLASS_YOU_TAKE")}</H3>}
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
          {fields.length > 0 && (
            <Stack space={3} alignItems="start" ml={6}>
              <Button
                variant="outline"
                leftIcon={
                  toggleDetails ? (
                    <ArrowUpIcon size="4" />
                  ) : (
                    <ArrowDownIcon size="4" />
                  )
                }
                onPress={handleToggleDetails}
              >
                {toggleDetails ? "Hide Details" : "Show Details"}
              </Button>

              <Collapse in={toggleDetails}>
                {fields.map((item, index) => {
                  return (
                    <HStack space={3} alignItems="center" key={index}>
                      <Text bold>{item.label}:</Text>
                      <Text>{item.values}</Text>
                    </HStack>
                  );
                })}
              </Collapse>
            </Stack>
          )}
          <VStack space={2}>
            {widgetData.map((item, index) => {
              // Check if the title is "Mark My Attendance"
              const isMarkMyAttendance =
                item.data[0].title === t("Mark My Attendance");

              // Assign onPress handler only to "Mark My Attendance" widget
              return (
                <Widget
                  {...item}
                  key={index}
                  {...(isMarkMyAttendance && { onpress: handleOnPress })}
                />
              );
            })}
          </VStack>
        </Layout>
      </SelfAttendanceSheet>
    );
  }
};

export default CohortDetails;
