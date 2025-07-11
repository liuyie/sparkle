import {
  mihomoRuleProviders,
  mihomoUpdateRuleProviders,
  getRuntimeConfig
} from '@renderer/utils/ipc'
import { getHash } from '@renderer/utils/hash'
import Viewer from './viewer'
import { Fragment, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import SettingCard from '../base/base-setting-card'
import SettingItem from '../base/base-setting-item'
import { Button, Chip } from '@heroui/react'
import { IoMdRefresh } from 'react-icons/io'
import { CgLoadbarDoc } from 'react-icons/cg'
import { MdEditDocument } from 'react-icons/md'
import dayjs from 'dayjs'

const RuleProvider: React.FC = () => {
  const [showDetails, setShowDetails] = useState({
    show: false,
    path: '',
    type: '',
    title: '',
    format: '',
    privderType: ''
  })
  useEffect(() => {
    if (showDetails.title) {
      const fetchProviderPath = async (name: string): Promise<void> => {
        try {
          const providers = await getRuntimeConfig()
          const provider = providers?.['rule-providers']?.[name] as ProxyProviderConfig
          if (provider) {
            setShowDetails((prev) => ({
              ...prev,
              show: true,
              path: provider?.path || `rules/${getHash(provider?.url || '')}`
            }))
          }
        } catch {
          setShowDetails((prev) => ({ ...prev, path: '' }))
        }
      }
      fetchProviderPath(showDetails.title)
    }
  }, [showDetails.title])

  const { data, mutate } = useSWR('mihomoRuleProviders', mihomoRuleProviders)
  const providers = useMemo(() => {
    if (!data) return []
    return Object.values(data.providers).sort((a, b) => {
      const order = { File: 1, Inline: 2, HTTP: 3 }
      return (order[a.vehicleType] || 4) - (order[b.vehicleType] || 4)
    })
  }, [data])
  const [updating, setUpdating] = useState(Array(providers.length).fill(false))

  const onUpdate = async (name: string, index: number): Promise<void> => {
    setUpdating((prev) => {
      prev[index] = true
      return [...prev]
    })
    try {
      await mihomoUpdateRuleProviders(name)
      mutate()
    } catch (e) {
      new Notification(`${name} 更新失败\n${e}`)
    } finally {
      setUpdating((prev) => {
        prev[index] = false
        return [...prev]
      })
    }
  }

  if (!providers.length) {
    return null
  }

  return (
    <SettingCard>
      {showDetails.show && (
        <Viewer
          path={showDetails.path}
          type={showDetails.type}
          title={showDetails.title}
          format={showDetails.format}
          privderType={showDetails.privderType}
          onClose={() =>
            setShowDetails({
              show: false,
              path: '',
              type: '',
              title: '',
              format: '',
              privderType: ''
            })
          }
        />
      )}
      <SettingItem title="规则集合" divider>
        <Button
          size="sm"
          color="primary"
          onPress={() => {
            providers.forEach((provider, index) => {
              onUpdate(provider.name, index)
            })
          }}
        >
          更新全部
        </Button>
      </SettingItem>
      {providers.map((provider, index) => (
        <Fragment key={provider.name}>
          <SettingItem
            title={provider.name}
            actions={
              <Chip className="ml-2" size="sm">
                {provider.ruleCount}
              </Chip>
            }
          >
            <div className="flex h-[32px] leading-[32px] text-foreground-500">
              <div>{dayjs(provider.updatedAt).fromNow()}</div>
              {provider.format !== 'MrsRule' && provider.vehicleType !== 'Inline' && (
                <Button
                  isIconOnly
                  title={provider.vehicleType == 'File' ? '编辑' : '查看'}
                  className="ml-2"
                  size="sm"
                  onPress={() => {
                    setShowDetails({
                      show: false,
                      privderType: 'rule-providers',
                      path: provider.name,
                      type: provider.vehicleType,
                      title: provider.name,
                      format: provider.format
                    })
                  }}
                >
                  {provider.vehicleType == 'File' ? (
                    <MdEditDocument className={`text-lg`} />
                  ) : (
                    <CgLoadbarDoc className={`text-lg`} />
                  )}
                </Button>
              )}
              <Button
                isIconOnly
                title="更新"
                className="ml-2"
                size="sm"
                onPress={() => {
                  onUpdate(provider.name, index)
                }}
              >
                <IoMdRefresh className={`text-lg ${updating[index] ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </SettingItem>
          <SettingItem
            title={<div className="text-foreground-500">{provider.format || 'InlineRule'}</div>}
            divider={index !== providers.length - 1}
          >
            <div className="h-[32px] leading-[32px] text-foreground-500">
              {provider.vehicleType}::{provider.behavior}
            </div>
          </SettingItem>
        </Fragment>
      ))}
    </SettingCard>
  )
}

export default RuleProvider
