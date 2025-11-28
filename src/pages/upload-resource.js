import CommunityUploadForm from "@/components/form/CommunityUploadForm"
import { withAuth } from "@/utils/auth"

function UploadResourcePage() {
  return (
    <div className="w-full px-3 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Submit a Resource</h1>
      <CommunityUploadForm />
    </div>
  )
}

// Protect this page with authentication
export default withAuth(UploadResourcePage)

