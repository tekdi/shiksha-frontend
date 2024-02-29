import React, { useEffect, useState } from "react";
import {
  Box,
  HStack,
  VStack,
  Pressable,
  Image,
  Avatar,
  Button,
  Flex,
  Text,
} from "native-base";
import { TouchableOpacity, Modal, View } from "react-native";
import { useTranslation } from "react-i18next";
import { generatePath, useParams, useNavigate } from "react-router-dom";
import {
  Layout,
  overrideColorTheme,
  IconByName,
  H4,
  cohortRegistryService,
  Loading,
  useWindowSize,
  attendanceRegistryService,
} from "@shiksha/common-lib";
import moment from "moment";
import manifest from "../manifest.json";
const colors = overrideColorTheme();

export default function CohortMemberList({ footerLinks, appName }) {
  const { t } = useTranslation();
  const [userId, setUserId] = useState();
  const [width, height] = useWindowSize();
  const [loading, setLoading] = React.useState(true);
  const [cohortDetails, setCohortDetails] = React.useState({});
  const [cohortParentDetails, setCohortParentDetails] = React.useState(true);
  const [attendanceStatusData, setAttendanceStatusData] = React.useState();
  let newAvatar = localStorage.getItem("fullName");
  const [successLayout, setsuccessLayout] = React.useState("false");
  const [members, setMembers] = useState([]);
  const teacherId = localStorage.getItem("id");
  const { cohortId } = useParams();
  const [selectedAttendance, setSelectedAttendance] = useState({
    type: "", // or initialize with "Present" or "Absent" based on your initial state requirement
    records: [],
  });
  const [checkedAllAs, setcheckedAllAs] = React.useState(true);
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
    let names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleToggleAttendance = (memberId, status) => {
    // Check if the member is already selected with the same status
    const isSelected =
      selectedAttendance &&
      selectedAttendance.records.some(
        (record) => record.userId === memberId && record.attendance === status
      );

    // Toggle the attendance status for the member
    let updatedAttendanceRecords = [];
    if (isSelected) {
      // Remove the member with the same status from the selectedAttendance
      updatedAttendanceRecords = selectedAttendance.records.filter(
        (record) =>
          !(record.userId === memberId && record.attendance === status)
      );
    } else {
      // Add or update the member with the new status in the selectedAttendance
      updatedAttendanceRecords = [
        ...selectedAttendance.records.filter(
          (record) => record.userId !== memberId
        ),
        {
          userId: memberId,
          attendance: status,
          contextType: "class",
          contextId: cohortId,
          attendanceDate: moment().format("YYYY-MM-DD"),
        },
      ];
    }
    // Update selectedAttendance state
    setSelectedAttendance({
      type: status,
      records: updatedAttendanceRecords,
    });
    setcheckedAllAs("");
  };

  // Event handler for selecting all as Present
  const handleSelectAllPresent = () => {
    setSelectedAttendance({});
    setAttendanceStatusData();
    let updatedAttendanceRecords = [];
    members.forEach((member) => {
      let updatedAttendance = {
        userId: member?.userId,
        attendance: "Present",
        contextType: "class",
        contextId: cohortId,
        attendanceDate: moment().format("YYYY-MM-DD"),
      };
      updatedAttendanceRecords.push(updatedAttendance);
    });
    setSelectedAttendance({
      type: "Present",
      records: updatedAttendanceRecords,
    });
    setcheckedAllAs("Present");
  };

  // Event handler for selecting all as Absent
  const handleSelectAllAbsent = () => {
    setSelectedAttendance({});
    setAttendanceStatusData();
    let updatedAttendanceRecords = [];
    members.forEach((member) => {
      let updatedAttendance = {
        userId: member?.userId,
        attendance: "Absent",
        contextType: "class",
        contextId: cohortId,
        attendanceDate: moment().format("YYYY-MM-DD"),
      };
      updatedAttendanceRecords.push(updatedAttendance);
    });
    setSelectedAttendance({
      type: "Absent",
      records: updatedAttendanceRecords,
    });
    setcheckedAllAs("Absent");
  };

  useEffect(() => {
    let ignore = false;
    const getData = async () => {
      const currentDate = new Date().toLocaleDateString("en-CA"); // Format: "yyyy-mm-dd"
      const searchData = {
        limit: 200,
        page: 0,
        filters: {
          contextId: { _eq: cohortId },
          userId: { _eq: userId },
          contextType: { _eq: "class" },
          attendanceDate: { _eq: currentDate },
        },
      };

      if (!ignore) {
        const results = await Promise.all([
          cohortRegistryService.getCohortMembers(
            {
              limit: 200,
              page: 0,
              filters: {
                cohortId: { _eq: cohortId },
                role: { _eq: "student" },
              },
            },
            {
              tenantid: process.env.REACT_APP_TENANT_ID,
            }
          ),
          cohortRegistryService.getCohortDetails(
            {
              cohortId: cohortId,
            },
            {
              tenantid: process.env.REACT_APP_TENANT_ID,
            }
          ),
        ]);

        // get status of use attendance from attendanceSearchData api
        const attendanceSearchData =
          await attendanceRegistryService.searchAttendance(searchData, {
            Tenantid: process.env.REACT_APP_TENANT_ID,
          });
        if (
          attendanceSearchData?.data &&
          attendanceSearchData.data.length > 0
        ) {
          setAttendanceStatusData(attendanceSearchData.data);

          // Merge attendance status into user data
          const modifiedCohortMembers = results[0]?.map((member) => {
            const attendanceRecord = attendanceSearchData.data.find(
              (record) => record.userId === member.userId
            );
            return {
              ...member,
              attendanceStatus: attendanceRecord
                ? attendanceRecord.attendance
                : "",
            };
          });
          setMembers(modifiedCohortMembers);
        } else {
          setMembers(results[0]);
        }
        setCohortDetails(results[1][0]);
        const parentResult = await cohortRegistryService.getCohortDetails(
          {
            cohortId: results[1][0].parentId,
          },
          {
            tenantid: process.env.REACT_APP_TENANT_ID,
          }
        );
        if (parentResult.length) {
          setCohortParentDetails(parentResult[0]);
        }
        setLoading(false);
      }
    };
    getData();
  }, [teacherId]);

  return (
    <Layout
      _header={{
        title: loading
          ? ""
          : cohortParentDetails?.name + ", " + " Level " + cohortDetails?.name,
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
      {loading ? (
        <Loading height={height - height / 2} />
      ) : (
        <Box pb={4} pt="30">
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={toggleModal}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#ececec",
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                <Text style={{ marginBottom: 10, color: "#000" }}>
                  Please select the attendance for at least one student
                </Text>
                <View style={{ marginBottom: 10 }} />
                <Button
                  _text={{ color: "profile.white" }}
                  onPress={toggleModal}
                >
                  Ok
                </Button>
              </View>
            </View>
          </Modal>
          <VStack space={2}>
            <HStack
              px={4}
              justifyContent="space-between"
              bg={colors?.lightGray6}
              p={2}
            >
              <Flex mt={5}>
                <Text>Mark All As</Text>
              </Flex>
              <HStack w={130} justifyContent="space-between">
                <Flex>
                  <TouchableOpacity>
                    <IconByName
                      name="CheckboxCircleLineIcon"
                      color={
                        checkedAllAs == "Present" ? "profile.present" : "gray"
                      }
                      _icon={{
                        size: "25px",
                      }}
                      onPress={handleSelectAllPresent}
                    />
                  </TouchableOpacity>
                  <Text textAlign={"center"}>Present</Text>
                </Flex>
                <Flex>
                  <TouchableOpacity>
                    <IconByName
                      name="CloseCircleLineIcon"
                      color={
                        checkedAllAs == "Absent" ? "profile.absent" : "gray"
                      }
                      _icon={{
                        size: "25px",
                      }}
                      onPress={handleSelectAllAbsent}
                    />
                  </TouchableOpacity>
                  <Text textAlign={"center"}>Absent</Text>
                </Flex>
              </HStack>
            </HStack>
            {members.map((item, index) => {
              let attendanceRecord = attendanceStatusData?.find(
                (record) => record?.userId === item?.userId
              );
              let changedRecord = selectedAttendance?.records?.find(
                (record) => record?.userId === item?.userId
              );
              let memberAttendance = "";
              if (changedRecord && changedRecord?.userId) {
                memberAttendance = changedRecord?.attendance;
              } else {
                memberAttendance = attendanceRecord?.attendance;
              }

              return (
                <Box
                  p="2"
                  m="2"
                  rounded={"lg"}
                  key={index}
                  _text={{
                    fontSize: "md",
                    fontWeight: "medium",
                    color: "black",
                  }}
                  shadow={2}
                >
                  <HStack justifyContent="space-between">
                    <VStack>
                      <H4>{item?.userDetails?.name}</H4>
                    </VStack>
                    <HStack space={2}>
                      {attendanceRecord ? (
                        <Button colorScheme="primary">
                          {attendanceRecord.attendance}
                        </Button>
                      ) : null}

                      <HStack w={130} justifyContent="space-between">
                        <Flex>
                          <TouchableOpacity>
                            <IconByName
                              name="CheckboxCircleLineIcon"
                              color={
                                memberAttendance === "Present"
                                  ? "profile.present"
                                  : "gray"
                              }
                              _icon={{
                                size: "25px",
                              }}
                              onPress={() => {
                                handleToggleAttendance(item.userId, "Present");
                                // Update color status for Present icon only
                                // based on the current selected status
                                setSelectedAttendance((prevState) => ({
                                  ...prevState,
                                  type: "Present",
                                }));
                              }}
                            />
                          </TouchableOpacity>
                          <Text textAlign={"center"}>Present</Text>
                        </Flex>
                        <Flex>
                          <TouchableOpacity>
                            <IconByName
                              name="CloseCircleLineIcon"
                              color={
                                memberAttendance === "Absent"
                                  ? "profile.absent"
                                  : "gray"
                              }
                              _icon={{
                                size: "25px",
                              }}
                              onPress={() => {
                                handleToggleAttendance(item.userId, "Absent");
                                // Update color status for Absent icon only
                                // based on the current selected status
                                setSelectedAttendance((prevState) => ({
                                  ...prevState,
                                  type: "Absent",
                                }));
                              }}
                            />
                          </TouchableOpacity>
                          <Text textAlign={"center"}>Absent</Text>
                        </Flex>
                      </HStack>
                    </HStack>
                  </HStack>
                </Box>
              );
            })}
            {/* Clear and Finish buttons */}
            <Button.Group space={2}>
              <Button
                flex={1}
                variant="outline"
                onPress={(e) => {
                  navigate(`/cohorts/${cohortId}`);
                }}
              >
                {t("CANCEL")}
              </Button>
              <Button
                flex={1}
                _text={{ color: "profile.white" }}
                onPress={async () => {
                  if (
                    !selectedAttendance?.records ||
                    selectedAttendance.records.length === 0
                  ) {
                    // If no records are selected, show the modal alert
                    toggleModal();
                  } else {
                    // If records are selected, proceed with marking attendance
                    const result = await attendanceRegistryService.multiple(
                      selectedAttendance.records,
                      {
                        tenantid: process.env.REACT_APP_TENANT_ID,
                      }
                    );
                    if (result?.data?.statusCode === 200) {
                      window.location.reload();
                      setSuccessLayout("true");
                    }
                  }
                }}
              >
                {t("MARK_ATTENDANCE")}
              </Button>
            </Button.Group>
          </VStack>
        </Box>
      )}
    </Layout>
  );
}
