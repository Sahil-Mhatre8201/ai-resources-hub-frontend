import CommunityUploadForm from "@/components/form/CommunityUploadForm"
import { withAuth } from "@/utils/auth"

function UploadResourcePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Submit a Resource</h1>
      <CommunityUploadForm />
    </div>
  )
}

// Protect this page with authentication
export default withAuth(UploadResourcePage)

