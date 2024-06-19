import React, { useState } from "react";
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
  attendanceRegistryService,
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
  let newAvatar = localStorage.getItem("fullName");
  const [userId, setUserId] = React.useState();
  const { cohortId } = useParams();
  const [attendanceStatusData, setAttendanceStatusData] = React.useState();
  let isDisabled = false;
  let scope = "self";
  let captureLocation = "true";
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
    {
      title: t("Mark Student Attendance"),
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

  let getInitials = function (string) {
    let names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

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
      const currentDate = new Date().toLocaleDateString("en-CA"); // Format: "yyyy-mm-dd"
      const searchData = {
        limit: "string",
        page: 0,
        filters: {
          contextId: { _eq: cohortId },
          userId: { _eq: localStorage.getItem("id") },
          contextType: { _eq: "class" },
          attendanceDate: { _eq: currentDate },
        },
      };

      // get status of use attendance from attendanceSearchData api
      const attendanceSearchData =
        await attendanceRegistryService.searchAttendance(searchData, {
          tenantid: process.env.REACT_APP_TENANT_ID,
        });

      if (attendanceSearchData?.data && attendanceSearchData.data.length > 0) {
        setAttendanceStatusData(attendanceSearchData);
      }
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

  /* Start - Check for allowing to self mark attendance on the basis of slot allowed to mark the attendance against the respective cohort & also check for late mark attendance */
  // Convert self_attendance_start to use a colon if it uses a dot
  if (cohortDetails?.params != undefined) {
    let selfAttendanceStart =
      cohortDetails?.params?.self_attendance_start?.replace(".", ":");

    // Function to parse time safely
    const parseTime = (timeString) => {
      if (!timeString) return [0, 0]; // Handle null, undefined, and empty string

      const parts = timeString.split(":").map(Number);
      if (parts.length !== 2 || parts.some(isNaN)) return [0, 0]; // Invalid format or NaN check

      return parts;
    };

    // Get current time
    const currentTime = new Date();
    const currentHours = currentTime.getHours().toString().padStart(2, "0");
    const currentMinutes = currentTime.getMinutes().toString().padStart(2, "0");
    const formattedCurrentTime = `${currentHours}:${currentMinutes}`;

    // Calculate 5 minutes before self_attendance_start
    const [startHours, startMinutes] = parseTime(selfAttendanceStart);
    let fiveMinutesBeforeHours = startHours;
    let fiveMinutesBeforeMinutes = startMinutes - 5;
    if (fiveMinutesBeforeMinutes < 0) {
      fiveMinutesBeforeHours -= 1;
      fiveMinutesBeforeMinutes += 60;
    }
    const fiveMinutesBeforeStart = `${fiveMinutesBeforeHours
      .toString()
      .padStart(2, "0")}:${fiveMinutesBeforeMinutes
      .toString()
      .padStart(2, "0")}`;

    // Get end time safely
    const selfAttendanceEnd =
      cohortDetails?.params?.self_attendance_end ?? "23:59";

    // Check if current time is within the attendance window or 5 minutes before start
    const isWithinAttendanceWindow =
      (formattedCurrentTime >= fiveMinutesBeforeStart &&
        formattedCurrentTime < selfAttendanceStart) ||
      (formattedCurrentTime >= selfAttendanceStart &&
        formattedCurrentTime <= selfAttendanceEnd);

    // Check if current time is past self_attendance_end and allow late marking is 1
    const isLateMarkingAllowed =
      formattedCurrentTime > selfAttendanceEnd &&
      cohortDetails?.params?.allow_late_marking == "true";

    // Determine if the widget should be disabled
    const isDisabled = !(isWithinAttendanceWindow || isLateMarkingAllowed);
  }

  /* End - Check for allowing to self mark attendance on the basis of slot allowed to mark the attendance against the respective cohort & also check for late mark attendance */

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
          captureLocation, // parameter for captureLocation
          scope,
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
                  <Avatar>{getInitials(newAvatar)}</Avatar>
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
              const isMarkMyAttendance = item.title === t("Mark My Attendance");

              let modifiedTitle = item?.title;
              if (
                isMarkMyAttendance &&
                attendanceStatusData?.data[0]?.attendance
              ) {
                modifiedTitle += `                           - ${attendanceStatusData?.data[0]?.attendance}`;
                isDisabled = true;
              }
              return (
                <Widget
                  {...item}
                  key={index}
                  data={[
                    {
                      ...item,
                      title: modifiedTitle, // Updated title
                      _box: {
                        bg:
                          item?.title === "Mark My Attendance" &&
                          isDisabled === true
                            ? "#f2f2f2"
                            : item?.title !== "Mark My Attendance"
                            ? "widgetColor.600"
                            : "widgetColor.500",
                      },
                    },
                  ]}
                  {...(isMarkMyAttendance && { onpress: handleOnPress })} // Fixed typo: 'onpress' to 'onPress'
                  disabled={isDisabled}
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
