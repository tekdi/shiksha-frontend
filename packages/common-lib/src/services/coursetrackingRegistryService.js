import mapInterfaceData from './mapInterfaceData'
import { get, post, update as coreUpdate } from './RestClient'
import * as likeRegistryService from './likeRegistryService'
import * as commentRegistryService from './commentRegistryService'
import * as courseRegistryService from './courseRegistryService'
import moment from 'moment'

const interfaceData = {
  id: 'courseTrackingId',
  courseId: 'courseId',
  source: 'source',
  userId: 'userId',
  progressDetail: 'progressDetail',
  contentIds: 'contentIds',
  startTime: 'startTime',
  endTime: 'endTime',
  certificate: 'certificate',
  status: 'status',
  date: 'date',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
}

let only = Object.keys(interfaceData)

export const getAll = async ({ ...params } = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  const result = await get(
    `https://sunbirdsaas.com/api/course/v1/hierarchy/do_11390060253845094411834?`,
    null,
    { params, headers }
  )
  if (result) {
    return result
    // return await getDataWithCourse(result.data.data)
  } else {
    return []
  }
}

export const getOne = async ({ ...params } = {}, header = {}) => {

  console.log(params.doID)
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  const result = await get(
    `https://sunbirdsaas.com/api/course/v1/hierarchy/` + params.doID,
    null,
    { params, headers }
  )
  if (result) {
    return result
    // return await getDataWithCourse(result.data.data)
  } else {
    return []
  }
}

// export const getOne = async (filters = {}, header = {}) => {
//   let headers = {
//     ...header,
//     Authorization: 'Bearer ' + localStorage.getItem('token')
//   }
//   try {
//     const result = await get(
//       process.env.REACT_APP_API_URL + '/coursetracking/' + filters.id,
//       {
//         headers
//       }
//     )
//     if (result?.data?.data) {
//       const data = result?.data?.data[0]
//         ? result?.data?.data[0]
//         : result?.data?.data
//       return await getDataWithCourseOne(data)
//     } else {
//       return {}
//     }
//   } catch {
//     return {}
//   }
// }

export const getLikes = async (id) => {
  return await likeRegistryService.getAll({
    contextId: { eq: id },
    context: { eq: 'CourseTracking' },
    type: { eq: 'like' }
  })
}

export const getComments = async (id, filter = {}) => {
  return await commentRegistryService.getAll({
    contextId: { eq: id },
    context: { eq: 'CourseTracking' },
    ...filter
  })
}

const getDataWithCourse = async (data) => {
  return await Promise.all(
    data.map(async (item) => await getDataWithCourseOne(item))
  )
}

const getDataWithCourseOne = async (object) => {
  let courseData = {}
  const item = mapInterfaceData(object, interfaceData)
  if (item.courseId && item.source) {
    let resultData = await courseRegistryService.getOne({
      id: item.courseId,
      adapter: item.source
    })

    let { id, ...peops } = resultData
    courseData = peops
  }
  return {
    ...item,
    ...courseData,
    duration: moment
      .duration(
        moment(item.endTime, 'hh:ss').diff(moment(item.startTime, 'hh:ss'))
      )
      .asMinutes(),
    dueDate: item.endTime
  }
}
