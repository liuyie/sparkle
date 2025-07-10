import { Button, Card, CardBody, CardFooter, Tooltip } from '@heroui/react'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IoLayersOutline } from 'react-icons/io5'
import { useAppConfig } from '@renderer/hooks/use-app-config'

interface Props {
  iconOnly?: boolean
}

const ResourceCard: React.FC<Props> = (props) => {
  const { appConfig } = useAppConfig()
  const { iconOnly } = props
  const { resourceCardStatus = 'col-span-1' } = appConfig || {}
  const location = useLocation()
  const navigate = useNavigate()
  const match = location.pathname.includes('/resources')
  const {
    attributes,
    listeners,
    setNodeRef,
    transform: tf,
    transition,
    isDragging
  } = useSortable({
    id: 'resource'
  })
  const transform = tf ? { x: tf.x, y: tf.y, scaleX: 1, scaleY: 1 } : null

  if (iconOnly) {
    return (
      <div className={`${resourceCardStatus} flex justify-center`}>
        <Tooltip content="外部资源" placement="right">
          <Button
            size="sm"
            isIconOnly
            color={match ? 'primary' : 'default'}
            variant={match ? 'solid' : 'light'}
            onPress={() => {
              navigate('/resources')
            }}
          >
            <IoLayersOutline className="text-[20px]" />
          </Button>
        </Tooltip>
      </div>
    )
  }
  return (
    <div
      style={{
        position: 'relative',
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 'calc(infinity)' : undefined
      }}
      className={`${resourceCardStatus} resource-card`}
    >
      <Card
        fullWidth
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={`${match ? 'bg-primary' : 'hover:bg-primary/30'} ${isDragging ? 'scale-[0.97] tap-highlight-transparent' : ''}`}
      >
        <CardBody className="pb-1 pt-0 px-0 overflow-y-visible">
          <div className="flex justify-between">
            <Button
              isIconOnly
              className="bg-transparent pointer-events-none"
              variant="flat"
              color="default"
            >
              <IoLayersOutline
                color="default"
                className={`${match ? 'text-primary-foreground' : 'text-foreground'} text-[24px] font-bold`}
              />
            </Button>
          </div>
        </CardBody>
        <CardFooter className="pt-1">
          <h3
            className={`text-md font-bold ${match ? 'text-primary-foreground' : 'text-foreground'}`}
          >
            外部资源
          </h3>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ResourceCard
