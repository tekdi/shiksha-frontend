import React, { useEffect, useState } from "react";
import { Box, HStack, VStack, Text, Heading } from "native-base";
import { useTranslation } from "react-i18next";
import { generatePath } from "react-router-dom";
import {
  H4,
  Widget,
  cohortRegistryService,
  Loading,
  useWindowSize,
} from "@shiksha/common-lib";
// import ChooseClassActionSheet from "./Molecules/ChooseClassActionSheet";

export default function CohortList() {
  const { t } = useTranslation();
  const [classes, setClasses] = useState([]);
  const [width, height] = useWindowSize();
  const [loading, setLoading] = useState(true);
  const teacherId = localStorage.getItem("id");
  useEffect(() => {
    let ignore = false;
    // Get the cohortIds from the cohortMembers having role as teacher for logged in user(teacher)
    const getCohortIdsData = async () => {
      if (!ignore) {
        const cohortMemebersData = await cohortRegistryService.getCohortMembers(
          {
            filters: {
              userId: {
                _in: teacherId,
              },
              role: { _eq: "teacher" },
            },
          },
          {
            tenantid: process.env.REACT_APP_TENANT_ID,
          }
        );
        if (cohortMemebersData) {
          const cohortIdsInfo = cohortMemebersData.map(
            (item) => `${item.cohortId}`
          );
          const cohortIdsData = cohortIdsInfo.join(", ");
          getData(cohortIdsData);
        } else {
          getData();
        }
      }
    };

    getCohortIdsData();

    // Get the cohort
    const getData = async (cohortIdsData) => {
      if (!ignore) {
        let classesData;
        if (cohortIdsData) {
          const cohortIdsDataArray = cohortIdsData
            .split(",")
            .map((param) => param.trim());
          classesData = await cohortRegistryService.getAll(
            {
              filters: {
                cohortId: {
                  _in: cohortIdsDataArray,
                },
                type: { _eq: "CLASS" },
              },
            },
            {
              tenantid: process.env.REACT_APP_TENANT_ID,
            }
          );
        } else {
          // If no cohortIdsData, call getAll without cohortIdsData
          classesData = await cohortRegistryService.getAll(
            {
              teacherId: teacherId,
              type: "class",
              role: "teacher",
            },
            {
              tenantid: process.env.REACT_APP_TENANT_ID,
            }
          );
        }
        setClasses(classesData);
        // Fetch parent data for each class and add parent name to each class object
        /*const updatedClassesData = await Promise.all(
          classesData?.map(async (classItem) => {
            const parentData = await cohortRegistryService.getCohortDetails(
              {
                cohortId: classItem?.parentId,
              },
              {
                tenantid: process.env.REACT_APP_TENANT_ID,
              }
            );
            const parentName =
              parentData?.length > 0 ? parentData[0]?.name : ""; // Get parent name from the first object in the parentData array
            return { ...classItem, parentName };
          })
        );
        setClasses(updatedClassesData);*/
        setLoading(false);
      }
    };
    // Cleanup function
    return () => {
      ignore = true;
    };
  }, [teacherId]);

  if (loading) {
    return <Loading height={height - height / 2} />;
  }

  return classes?.length ? (
    <Box pb={4} pt="30">
      <VStack space={10}>
        <Widget
          data={classes.map((item, index) => {
            return {
              title:
                (item?.name ? item?.name : "") +
                (item?.section ? " • Sec " + item?.section : ""),
              //subTitle: t("CLASS_TEACHER"),
              link: generatePath(item.id, { ...{ id: item.id } }),
              _box: {
                style: {
                  background:
                    index % 2 === 0
                      ? "linear-gradient(281.03deg, #FC5858 -21.15%, #F8AF5A 100.04%)"
                      : "linear-gradient(102.88deg, #D7BEE6 -5.88%, #B143F3 116.6%)",
                },
              },
            };
          })}
        />
        {/* <HStack space={2} justifyContent={"center"}>
          <ChooseClassActionSheet />
        </HStack> */}
      </VStack>
    </Box>
  ) : (
    <H4 textAlign="center" mb="10" mt="10">
      {t("NO_CLASSES_FOUND")}
    </H4>
  );
}
