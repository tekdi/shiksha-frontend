import { Layout, H3, overrideColorTheme, cohortRegistryService, useWindowSize, Loading } from '@shiksha/common-lib'
import manifest from "../manifest.json";
import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import UserList from 'components/UserList';
import CohortList from 'components/CohortList';

function ManageCohorts({footerLinks, appName}) {
  const { t } = useTranslation();
  const colors = overrideColorTheme();
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [width, height] = useWindowSize();

  useEffect(() => {
    cohortRegistryService.getAll({}, {
      tenantid: process.env.REACT_APP_TENANT_ID
    }).then((res) => {
      console.log(res);
      setCohorts(res);
      setLoading(false);
    }).catch((err) => {
      console.log(err);
    });
  }, []);


  if (loading) {
    return <Loading height={height - height / 2} message={t("LOADING")} />;
  }

  return (
    <Layout
      mb={10}
      _header={{
        title: t("MANAGE_COHORTS"),
      }}
      _appBar={{ languages: manifest.languages }}
      // subHeader={
      //   <H3 textTransform="none">{t("Submit the below given form")}</H3>
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
    <CohortList cohorts={cohorts}  />
    </Layout>
  )
}

export default ManageCohorts