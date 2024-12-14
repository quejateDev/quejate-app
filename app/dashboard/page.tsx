import { PrismaClient } from '@prisma/client'

export default async function AdminDashboard() {
  const prisma = new PrismaClient()
  
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Department Management */}
        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Departments</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="departmentName" className="block mb-2">Department Name</label>
              <input 
                type="text" 
                id="departmentName"
                className="w-full p-2 border rounded"
              />
            </div>
            <button 
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Department
            </button>
          </form>
        </section>

        {/* Employee Management */}
        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create Employee</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block mb-2">First Name</label>
              <input 
                type="text" 
                id="firstName"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block mb-2">Last Name</label>
              <input 
                type="text" 
                id="lastName"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2">Email</label>
              <input 
                type="email" 
                id="email"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2">Phone</label>
              <input 
                type="tel" 
                id="phone"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="department" className="block mb-2">Department</label>
              <select 
                id="department"
                className="w-full p-2 border rounded"
              >
                <option value="">Select Department</option>
              </select>
            </div>
            <button 
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Employee
            </button>
          </form>
        </section>
      </div>
    </main>
  )
} 