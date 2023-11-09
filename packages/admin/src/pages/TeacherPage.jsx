import React from "react";
import styles from "./TeacherPage.module.css";
import { H4, Heading, BodyLarge } from "@shiksha/common-lib";
import { Layout, NameTag } from "@shiksha/common-lib";
import { Box, Stack, VStack, HStack, Avatar, Image, Button } from "native-base";
import { useTranslation } from "react-i18next";
import moment from "moment";
import manifest from "../../src/manifest.json";
import { useState } from "react";
import CSVModal from "react-modal";
import FORMmodal from "react-modal";
import "ag-grid-community/styles/ag-grid.css";
import TeacherListView from "components/TeacherListView";
import TeacherCSVImport from "components/TeacherCSV";
import TeacherForm from "components/TeacherForm";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import teacherCSV from "../assets/images/FinalTeacher.csv";

function TeacherPage() {
  const [loading, setLoading] = React.useState(false);
  const [isCSVOpen, setIsCSVOpen] = useState(false);
  const [isFORMOpen, setIsFORMOpen] = useState(false);
  const { t } = useTranslation();

  const openCSVModal = () => {
    localStorage.removeItem("bulkErrors");
    localStorage.removeItem("successCount");
    setIsCSVOpen(true);
  };
  const openFORMModal = () => {
    setIsFORMOpen(true);
  };
  const closeCSVModal = () => {
    setIsCSVOpen(false);
  };
  const closeFORMModal = () => {
    setIsFORMOpen(false);
  };

  const sampleCSV = async () => {
    try {
      const response = await fetch(teacherCSV);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "FinalTeacher.csv";
      link.click();
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };
  //csv modal styles
  const customStyles = {
    content: {
      width: "auto",
      height: "auto",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <div className={styles.mainDiv}>
      <Layout
        loading={loading}
        _header={{
          title: t("TEACHER PAGE"),
          subHeading: moment().format("hh:mm:ss A"),
        }}
        _appBar={{
          languages: manifest.languages,
          isLanguageIcon: true,
          isShowNotificationButton: false,
          titleComponent: <NameTag />,
          _text_logo: <HStack></HStack>,
          LeftIcon: (
            <HStack>
              <img
                width={"100px"}
                src={require("./../assets/images/TSHeader.png")}
              />
            </HStack>
          ),
        }}
        _footer={{
          menues: [
            {
              title: "HOME",
              icon: "Home4LineIcon",
              route: "/",
            },
            {
              title: "STUDENT",
              icon: "TeamLineIcon",
              route: "/studentpage",
            },
            {
              title: "SCHOOL",
              icon: "GovernmentLineIcon",
              route: "/schoolpage",
            },

            {
              title: "TEACHER",
              icon: "UserLineIcon",
              route: "/teacherpage",
            },
          ],
        }}
      >
        <Box bg="white" rounded={"2x1"} py={6} px={4} mb={5} shadow={3}>
          <Stack>
            <VStack space={4}>
              <Box>
                <H4>Upload data using a custom form</H4>{" "}
                <Button onPress={openFORMModal}>FORM</Button>{" "}
                <H4>Import data using with a CSV File</H4>{" "}
                <Button onPress={openCSVModal}>CSV</Button>{" "}
                <BodyLarge>Download Sample CSV</BodyLarge>
                <Button style={{ width: "80px" }} onPress={sampleCSV}>
                  <FileDownloadOutlinedIcon
                    style={{ color: "white", fontSize: "largest" }}
                  />
                </Button>
              </Box>
              <Heading>Teacher Records list</Heading>
              {isCSVOpen && (
                <CSVModal
                  style={customStyles}
                  isOpen={isCSVOpen}
                  onRequestClose={closeCSVModal}
                  contentLabel="Edit Modal"
                  ariaHideApp={false}
                >
                  <button
                    onClick={closeCSVModal}
                    className={styles.closeButton}
                  >
                    ❌
                  </button>
                  <div className={styles.bodyDiv}>
                    <TeacherCSVImport />
                  </div>
                </CSVModal>
              )}
              {isFORMOpen && (
                <FORMmodal
                  isOpen={isFORMOpen}
                  onRequestClose={closeFORMModal}
                  contentLabel="Edit Modal"
                  ariaHideApp={false}
                >
                  <button
                    onClick={closeFORMModal}
                    className={styles.closeButton}
                  >
                    ❌
                  </button>
                  <div className={styles.bodyDiv}>
                    <TeacherForm />
                  </div>
                </FORMmodal>
              )}
              <TeacherListView />
            </VStack>
          </Stack>
        </Box>
      </Layout>
    </div>
  );
}

export default TeacherPage;
