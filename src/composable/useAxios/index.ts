import { AxiosInstance } from 'axios'

export const useAxios = () => {
  return inject<AxiosInstance>('$axios')!
}
