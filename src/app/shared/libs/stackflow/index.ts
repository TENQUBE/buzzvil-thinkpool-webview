'use client'

import { stackflow } from '@stackflow/react'
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic'
import 'reflect-metadata'

import { ANIMATION_DURATION } from '@/app/shared/config'
import isIos from '@/app/shared/utils/isIos'
import { historySyncPlugin } from '@/app/shared/libs/stackflow/history-sync'
import { basicUIPlugin } from '@/app/shared/libs/stackflow/basic-ui'
import Detail from '@/app/views/Detail'
import AdvBestItems from '@/app/views/AdvBestItems'
import Error from '@/app/views/Error'
import CoupangAdModal from '@/app/views/CoupangAdModal'

export enum ActivityNames {
  Detail = 'Detail',
  AdvBestItems = 'AdvBestItems',
  Error = 'Error',
  CoupangAdModal = 'CoupangAdModal'
}

export enum ActivityRoutes {
  Detail = '/detail',
  AdvBestItems = '/adv-best-items',
  Error = '/error',
  CoupangAdModal = '/coupang-ad-modal'
}

const activities = {
  Detail,
  AdvBestItems,
  Error,
  CoupangAdModal
}

export const routes: { [key in ActivityNames]: ActivityRoutes } = {
  [ActivityNames.Detail]: ActivityRoutes[ActivityNames.Detail],
  [ActivityNames.AdvBestItems]: ActivityRoutes[ActivityNames.AdvBestItems],
  [ActivityNames.Error]: ActivityRoutes[ActivityNames.Error],
  [ActivityNames.CoupangAdModal]: ActivityRoutes[ActivityNames.CoupangAdModal]
}

const getStackflowParams = () => {
  return {
    transitionDuration: ANIMATION_DURATION,
    activities,
    plugins: [
      historySyncPlugin({
        routes,
        fallbackActivity: () => ActivityNames.Detail
      }),
      basicRendererPlugin(),
      basicUIPlugin(
        () =>
          ({
            theme: 'cupertino'
          } as never)
      )
    ]
  }
}

export const { Stack, useFlow: useOriginFlow } = stackflow(getStackflowParams())

export const useFlow = () => {
  const { push: originPush, pop: originPop, replace: originReplace } = useOriginFlow()

  return {
    push: (activityName: ActivityNames, params: {}, options?: { animate?: boolean }) =>
      originPush(activityName, params, { animate: isIos() ? false : options?.animate }),
    pop: (count?: number, options?: { animate?: boolean }) =>
      originPop(count ? count : 1, { animate: isIos() ? false : options?.animate }),
    replace: (activityName: ActivityNames, params: {}, options?: { animate?: boolean }) =>
      originReplace(activityName, params, { animate: isIos() ? false : options?.animate })
  }
}

export default Stack
