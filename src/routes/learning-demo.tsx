import { createFileRoute } from '@tanstack/react-router'
import { LearningDemo } from '@/components/learning/demo/learning-demo'
import { LearningPageWrapper } from '@/components/learning/layout/learning-page-wrapper'

export const Route = createFileRoute('/learning-demo')({
  component: LearningDemoPage,
})

function LearningDemoPage() {
  return (
    <LearningPageWrapper>
      <LearningDemo />
    </LearningPageWrapper>
  )
}