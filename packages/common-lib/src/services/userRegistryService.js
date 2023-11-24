import mapInterfaceData from './mapInterfaceData'
import { get, post, update as updateRequest } from './RestClient'

const interfaceData = {
  id: 'userId',
  username: 'username',
  // fullName: 'fullName',
  fullName: 'name',
  firstName: 'name',
  lastName: 'lastName',
  email: 'email',
  aadhaar: 'aadhaar',
  cadre: 'cadre',
  compSkills: 'compSkills',
  designation: 'designation',
  image: 'image',
  workingStatus: 'workingStatus',
  birthDate: 'birthDate',
  block: 'block',
  bloodGroup: 'bloodGroup',
  createdAt: 'createdAt',
  disability: 'disability',
  district: 'district',
  employmentType: 'employmentType',
  gender: 'gender',
  homeDistance: 'homeDistance',
  joiningDate: 'joiningDate',
  maritalStatus: 'maritalStatus',
  middleName: 'middleName',
  // phoneNumber: 'phoneNumber',
  phoneNumber: 'mobile',
  pincode: 'pincode',
  profQualification: 'profQualification',
  refId1: 'refId1',
  refId2: 'refId2',
  refId3: 'refId3',
  religion: 'religion',
  reportsTo: 'reportsTo',
  retirementDate: 'retirementDate',
  schoolId: 'schoolId',
  socialCategory: 'socialCategory',
  stateId: 'stateId',
  status: 'status',
  subjectIds: 'subjectIds',
  address: 'address',
  updatedAt: 'updatedAt',
  village: 'village',
  fcmToken: 'fcmToken',
  mergeParameterWithValue: {
    title: 'fullName'
  }
}

export const getAll = async (filters = {}, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }

  try {
    const result = await post(
      `${process.env.REACT_APP_API_URL}/user/search`,
      { filters },
      {
        headers
      }
    )
    if (result?.data?.data) {
      // return result.data.data.map((e) => mapInterfaceData(e, interfaceData))
      let res = result.data.data
      res = res.map((item) => {
        if (item?.fields) {
          item.fields = item.fields.map((field) => {
            item[field.name] = ''
            if (field?.fieldValues.length) {
              item[field.name] = field.fieldValues[0].value
            }
            return field;
          });
        }
        return item;
      })
      return res
    } else {
      return []
    }
  } catch (e) {
    console.log(e)
  }
}

export const getOne = async ({ id, ...params } = {}, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }
  let url = `${process.env.REACT_APP_API_URL}/user`
  if (id) {
    url = `${process.env.REACT_APP_API_URL}/user/${id}`
  }
  const result = await get(url, {
    params,
    headers
  }).catch((error) => error)
  if (result.data && id) {
    localStorage.setItem('currentUser', JSON.stringify(result.data.data))
    return mapInterfaceData(result.data.data, interfaceData)
  } else if (result?.data?.data) {
    localStorage.setItem('currentUser', JSON.stringify(result.data.data[0]))
    return mapInterfaceData(result.data.data[0], interfaceData)
  } else {
    return {}
  }
}

export const getUserById = async (id, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }
  const result = await get(`${process.env.REACT_APP_API_URL}/user/${id}`, {
    headers
  }).catch((error) => error)
  if (result?.data && result?.data?.data) {
    return mapInterfaceData(result.data.data, interfaceData)
  } else {
    return {}
  }
}

export const update = async (data = {}, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }

  const result = await updateRequest(
    process.env.REACT_APP_API_URL + '/user/' + data.userId,
    data,
    { headers }
  )
  if (result?.data) {
    return result
  } else {
    return {}
  }
}

export const create = async (data = {}, header = {}) => {
  let headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    ...header
  }

  const result = await post(process.env.REACT_APP_API_URL + '/user', data, {
    headers
  })
  if (result?.data) {
    return result.data?.data
  } else {
    return {}
  }
}
