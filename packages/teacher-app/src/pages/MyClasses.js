import React from "react";
import {
  Text,
  Box,
  Pressable,
  Image,
  Avatar,
  HStack,
  Button,
} from "native-base";
import { useTranslation } from "react-i18next";
import {
  capture,
  Layout,
  Tab,
  overrideColorTheme,
  H3,
  IconByName,
} from "@shiksha/common-lib";
import moment from "moment";
import manifest from "../manifest.json";
import { useNavigate } from "react-router-dom";

const colors = overrideColorTheme();

const MyClassRoute = React.lazy(() => import("classes/MyClassRoute"));
const CohortList = React.lazy(() => import("cohort/CohortList"));
// const TimeTableRoute = React.lazy(() => import("calendar/TimeTableRoute"));

const PRESENT = "Present";
const ABSENT = "Absent";
const UNMARKED = "Unmarked";

const SelfAttendanceSheet = React.lazy(() =>
  import("profile/SelfAttendanceSheet")
);

const MyClasses = ({ footerLinks, setAlert, appName }) => {
  const { t } = useTranslation();
  const [selfAttendance, setSelfAttendance] = React.useState({});
  const [showModal, setShowModal] = React.useState(false);
  let newAvatar = localStorage.getItem("firstName");
  const navigate = useNavigate();

  let cameraUrl = "";
  let avatarUrlObject = cameraUrl
    ? {
        source: {
          uri: cameraUrl,
        },
      }
    : {};

  let getInitials = function (string) {
    let names = string.split(' '), initials = names[0].substring(0, 1).toUpperCase();
    
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  React.useEffect(() => {
    capture("PAGE");
  }, []);

  return (
    <SelfAttendanceSheet
      {...{
        setAlert,
        showModal,
        setShowModal,
        setAttendance: setSelfAttendance,
        appName,
      }}
    >
      <Layout
        _header={{
          title: t("MY_CLASSES"),
          subHeading: moment().format("hh:mm A"),
          iconComponent: (
            <Pressable onPress={(e) => setShowModal(false)}>
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
              {selfAttendance?.attendance ? (
                <IconByName
                  name={
                    selfAttendance.attendance === PRESENT &&
                    selfAttendance?.remark !== ""
                      ? "AwardFillIcon"
                      : selfAttendance.attendance === ABSENT
                      ? "CloseCircleFillIcon"
                      : "CheckboxCircleFillIcon"
                  }
                  isDisabled
                  color={
                    selfAttendance.attendance === PRESENT &&
                    selfAttendance?.remark !== ""
                      ? "attendance.special_duty"
                      : selfAttendance.attendance === ABSENT
                      ? "attendance.absent"
                      : "attendance.present"
                  }
                  position="absolute"
                  bottom="-5px"
                  right="-5px"
                  bg="white"
                  rounded="full"
                />
              ) : (
                ""
              )}
            </Pressable>
          ),
        }}
        _appBar={{ languages: manifest.languages }}
        subHeader={<H3 textTransform="none">{t("THE_CLASS_YOU_TAKE")}</H3>}
        // subHeader={
        //   <HStack  justifyContent={"space-between"}>
        //     <H3 textTransform="none">{t("THE_CLASS_YOU_TAKE")}</H3>
        //     <Button onPress={() => navigate("/cohorts/add")}>Create New Cohort</Button>
        //   </HStack>
        // }
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
        <Box bg="white" p="5" mb="4" roundedBottom={"xl"} shadow={2}>
          <Tab
            routes={[
              // { title: t("MY_CLASS"), component: <MyClassRoute /> },
              { title: t("MY_CLASSES"), component: <CohortList /> },
              // { title: t("TIME_TABLE"), component: <TimeTableRoute /> },
            ]}
          />
        </Box>
      </Layout>
    </SelfAttendanceSheet>
  );
};

export default MyClasses;
