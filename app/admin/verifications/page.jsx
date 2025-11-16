import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { getSecureFileUrl } from '../../../utils/s3';

const prisma = new PrismaClient();

export default async function AdminVerifications() {
  const session = await getServerSession();
  
  // Verify admin access
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  // Fetch pending verifications
  const pendingVerifications = await prisma.verificationAttempt.findMany({
    where: {
      status: 'PENDING',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          idDocument: true,
          businessDocument: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Pending Verifications
            </h1>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Submitted
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Documents
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pendingVerifications.map((verification) => (
                          <tr key={verification.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {verification.user.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {verification.user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {verification.type}
                              </span>
                              <div className="text-xs text-gray-500">
                                {verification.user.role}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(verification.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {verification.type === 'ID' && verification.user.idDocument && (
                                <a
                                  href={getSecureFileUrl(verification.user.idDocument)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sky-600 hover:text-sky-900"
                                >
                                  View ID Document
                                </a>
                              )}
                              {verification.type === 'BUSINESS' && verification.user.businessDocument && (
                                <a
                                  href={getSecureFileUrl(verification.user.businessDocument)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sky-600 hover:text-sky-900"
                                >
                                  View Business Document
                                </a>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <form action="/api/admin/verify" method="POST" className="inline-flex space-x-2">
                                <input type="hidden" name="verificationId" value={verification.id} />
                                <button
                                  type="submit"
                                  name="action"
                                  value="approve"
                                  className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md"
                                >
                                  Approve
                                </button>
                                <button
                                  type="submit"
                                  name="action"
                                  value="reject"
                                  className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md"
                                >
                                  Reject
                                </button>
                              </form>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}