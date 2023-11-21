import { VStack } from 'native-base'
import React from 'react'
import IconByName from './IconByName'
import { H2 } from '@shiksha/common-lib'
const NewSunbirdPlayer = ({
  public_url,
  setTrackData,
  handleExitButton,
  width,
  height,
  ...props
}) => {
  const { mimeType } = props
  let trackData = []
  const [url, setUrl] = React.useState("https://sunbirdsaaspublic.blob.core.windows.net/content/content/assets/do_11389701914878771211241/od_eng_u1_l1-playing-with-words.pdf")
  React.useEffect(() => {
    if (mimeType === 'application/pdf') {
      setUrl(`/pdf`)
    } else if (['video/mp4', 'video/webm'].includes(mimeType)) {
      setUrl(`/video`)
    } else if (['application/vnd.sunbird.questionset'].includes(mimeType)) {
      setUrl(`/quml`)
    } else if (
      [
        'application/vnd.ekstep.ecml-archive',
        'application/vnd.ekstep.html-archive',
        'application/vnd.ekstep.content-collection',
        'application/vnd.ekstep.h5p-archive',
        'video/x-youtube'
      ].includes(mimeType)
    ) {
      setUrl(`/content-player`)
    }
  }, [mimeType])

  React.useEffect(() => {
    if ([`/content-player`, `/quml`, `/pdf`, `/video`].includes()) {
      window.addEventListener(
        'message',
        (event) => {
          handleEvent(event)
        },
        false
      )
    }

    return () => {
      if ([`/content-player`, `/quml`, `/pdf`, `/video`].includes(url)) {
        window.removeEventListener('message', (val) => {})
      }
    }
  }, [url])

  const handleEvent = (event) => {
    const data = event?.data
    let telemetry = {}
    if (data && typeof data?.data === 'string') {
      telemetry = JSON.parse(data.data)
    } else if (data && typeof data === 'string') {
      telemetry = JSON.parse(data)
    } else if (data?.eid) {
      telemetry = data
    }

    if (telemetry?.eid === 'EXDATA') {
      try {
        const edata = JSON.parse(telemetry.edata?.data)
        if (edata?.statement?.result) {
          trackData = [...trackData, edata?.statement]
        }
      } catch (e) {
        console.log('telemetry format h5p is wrong', e.message)
      }
    }
    if (telemetry?.eid === 'ASSESS') {
      const edata = telemetry?.edata
      if (trackData.find((e) => e?.item?.id === edata?.item?.id)) {
        const filterData = trackData.filter(
          (e) => e?.item?.id !== edata?.item?.id
        )
        trackData = [
          ...filterData,
          {
            ...edata,
            sectionName: props?.children?.find(
              (e) => e?.identifier === telemetry?.edata?.item?.sectionId
            )?.name
          }
        ]
      } else {
        trackData = [
          ...trackData,
          {
            ...edata,
            sectionName: props?.children?.find(
              (e) => e?.identifier === telemetry?.edata?.item?.sectionId
            )?.name
          }
        ]
      }
      // console.log(telemetry, trackData)
    } else if (
      telemetry?.eid === 'INTERACT' &&
      mimeType === 'video/x-youtube'
    ) {
      // const edata = telemetry?.edata
      // trackData = [...trackData, edata]
    } else if (telemetry?.eid === 'END') {
      const summaryData = telemetry?.edata
      if (summaryData?.summary && Array.isArray(summaryData?.summary)) {
        const score = summaryData.summary.find((e) => e['score'])
        if (score?.score) {
          setTrackData({ score: score?.score, trackData })
        } else {
          setTrackData(telemetry?.edata)
          handleExitButton()
        }
      } else {
        setTrackData(telemetry?.edata)
      }
    } else if (
      telemetry?.eid === 'IMPRESSION' &&
      telemetry?.edata?.pageid === 'summary_stage_id'
    ) {
      setTrackData(trackData)
    } else if (['INTERACT', 'HEARTBEAT'].includes(telemetry?.eid)) {
      if (
        telemetry?.edata?.id === 'exit' ||
        telemetry?.edata?.type === 'EXIT'
      ) {
        handleExitButton()
      }
    }
  }

  if (url) {
    return (
      <VStack> 
        <IconByName
          name='CloseCircleLineIcon'
          onPress={() => {
            if (mimeType === 'application/vnd.ekstep.h5p-archive') {
              handleEvent({
                data: {
                  eid: 'IMPRESSION',
                  edata: { pageid: 'summary_stage_id' }
                }
              })
            }
            handleExitButton()
          }}
          position='relative'
          zIndex='10'
          right='15px'
          top='-500px'
          _icon={{ size: 40 }}
          bg='white'
          p='0'
          rounded='full'
        />
        <iframe
          style={{ border: 'none', position: 'absolute',
          marginLeft: "10%",
          width: "80%",
          height: "30em"}}
          id='preview'
         
          name={JSON.stringify({
            ...props,
            questionListUrl: 'https://sunbirdsaas.com/api/question/v1/list'
            // questionListUrl: `${process.env.REACT_APP_API_URL}/course/questionset`
          })}
          src={`${url}`}
        />
      </VStack>
    )
  } else {
    return <H2>{`${mimeType} this mime type not compatible`}</H2>
  }
}

export default React.memo(NewSunbirdPlayer)
