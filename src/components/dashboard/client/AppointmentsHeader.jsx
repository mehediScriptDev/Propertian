// "use client";

// import React from 'react';
// import { Plus } from 'lucide-react';

// export default function AppointmentsHeader({ count = 0, onNew }) {
//     return (
//         <div className="flex justify-between items-center mb-8">
//             <div>
//                 <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
//                 <p className="text-gray-600 mt-1">Total appointments: {count}</p>
//             </div>

//             <button
//                 onClick={onNew}
//                 className="bg-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
//             >
//                 <Plus size={18} />
//                 New Appointment
//             </button>
//         </div>
//     );
// }




"use client";

import React from 'react';
import { Plus } from 'lucide-react';

export default function AppointmentsHeader({ count = 0, onNew }) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-0">
            {/* Title & Count */}
            <div>
                <h1 className="text-3xl md:text-3xl font-bold text-gray-900">Appointments</h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                    Total appointments: {count}
                </p>
            </div>

            {/* New Appointment Button */}
            <button
                onClick={onNew}
                className="bg-primary text-white px-4 py-2 md:px-6 md:py-2 rounded-lg flex items-center gap-2 transition text-sm md:text-base"
            >
                <Plus size={16} className="md:mr-0" />
                New Appointment
            </button>
        </div>
    );
}
