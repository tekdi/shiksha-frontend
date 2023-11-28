import { Box, Button, HStack, Text, View } from "native-base";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function CohortList({ cohorts }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleEdit = (cohort) => {
    navigate("/admin/cohorts/edit", { state: cohort });
  };

  const handleDelete = (cohort) => {
    navigate("/admin/cohorts/delete", { state: cohort });
  };

  return (
    <>
      <View
        m={4}
        style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}
      >
        <Button onPress={() => navigate("/admin/cohorts/add")}>
          {t("ADD_COHORT")}
        </Button>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {cohorts.map((cohort, index) => (
            <Box
              key={cohort.cohortId}
              style={{
                width: "300px",
                margin: "2.5%",
                height: "150px",
                marginBottom: 10,
                background:
                  index % 2 === 0
                    ? "linear-gradient(281.03deg, #67e8f9 -70.15%, #0e7490 100.04%)"
                    : "linear-gradient(102.88deg, #D7BEE6 -70.88%, #B143F3 116.6%)",
              }}
              rounded="xl"
              shadow={3}
              p={5}
            >
              <Text
                noOfLines={2}
                {...{
                  fontSize: "md",
                  fontWeight: "bold",
                  color: "coolGray.50",
                }}
              >
                {cohort.name}
              </Text>

              <Text
                italic
                {...{
                  fontSize: "sm",
                  fontWeight: "medium",
                  color: "coolGray.50",
                }}
              >
                {cohort.status}
              </Text>

              <Text
                {...{
                  fontSize: "sm",
                  fontWeight: "medium",
                  color: "coolGray.50",
                }}
              >
                <b>{t("LOCATION")}: </b> {cohort?.location}
              </Text>

              <View
                style={{ position: "absolute", bottom: "8px", right: "8px" }}
              >
                <HStack mt={4}>
                  <Button onPress={() => handleEdit(cohort)} shadow={3}>
                    {t("EDIT")}
                  </Button>
                  <Button
                    onPress={() => handleDelete(cohort)}
                    ml={4}
                    isDisabled
                    shadow={3}
                  >
                    {t("DELETE")}
                  </Button>
                </HStack>
              </View>
            </Box>
          ))}
        </View>
      </View>
    </>
  );
}

export default CohortList;
