import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n';
import COUNTRY_CODES from '@/utils/countryCodes';
import ConciergeModal from '@/components/concierge/component/ConciergeModal';

export default function ConciergeForm({ onClose } = {}) {
	const { locale } = useLanguage();
	useTranslation(locale); // ensure locale hook runs (translations not used here)

	const [showModal, setShowModal] = useState(false);

	const [formState, setFormState] = useState({
		fullName: '',
		email: '',
		phone: '',
		moveDate: '',
		moveTiming: '',
		planDetails: '',
		countryOfResidence: 'CI',
		serviceNeeded: 'relocation',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormState((s) => ({ ...s, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setShowModal(true);
		console.log('Concierge request', formState);
		// keep minimal UX: reset optional fields
		setFormState((s) => ({ ...s, fullName: '', email: '', phone: '', moveTiming: '', planDetails: '' }));
		// show confirmation modal
		
	};

	return (
		<>
		<form onSubmit={handleSubmit} className='space-y-5' aria-label='Consultation booking form'>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
				<div>
					<label htmlFor='fullName' className='block text-[14px] font-medium text-charcoal mb-1.5'>
						Full Name
					</label>
					  <input id='fullName' name='fullName' value={formState.fullName} placeholder='Write your full name' onChange={handleChange} type='text' required className='w-full px-4 py-3 bg-background-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200' />
				</div>

				<div>
					<label htmlFor='email' className='block text-[14px] font-medium text-charcoal mb-1.5'>
						Email
					</label>
					  <input id='email' name='email' value={formState.email} onChange={handleChange} type='email' placeholder='you@example.com' required className='w-full px-4 py-3 bg-background-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200' />
				</div>

				<div>
					<label htmlFor='phone' className='block text-[14px] font-medium text-charcoal mb-1.5'>
						Phone / WhatsApp
					</label>
					  <input id='phone' name='phone' value={formState.phone} onChange={handleChange} type='tel' placeholder='+1 555 555 5555' required className='w-full px-4 py-3 bg-background-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200' />
				</div>

				<div>
					<label htmlFor='countryOfResidence' className='block text-[14px] font-medium text-charcoal mb-1.5'>
						Country of Residence
					</label>
					  <select id='countryOfResidence' name='countryOfResidence' value={formState.countryOfResidence} onChange={handleChange} className='w-full px-4 py-3 bg-background-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200'>
						{COUNTRY_CODES.map((c) => (<option key={c.iso2} value={c.iso2}>{c.name}</option>))}
					</select>
				</div>

				<div>
					<label htmlFor='moveDate' className='block text-[14px] font-medium text-charcoal mb-1.5'>
						Preferred Date & Time
					</label>
					  <input id='moveDate' name='moveDate' value={formState.moveDate} onChange={handleChange} type='datetime-local' required className='w-full px-4 py-3 bg-background-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200' />
				</div>

				<div>
					<label htmlFor='serviceNeeded' className='block text-[14px] font-medium text-charcoal mb-1.5'>
						Service Needed
					</label>
					  <select id='serviceNeeded' name='serviceNeeded' value={formState.serviceNeeded} onChange={handleChange} required className='w-full px-4 py-3 bg-background-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200'>
						<option value='relocation'>Relocation</option>
						<option value='schoolSearch'>School Search</option>
						<option value='neighborhoodSearch'>Neighborhood Search</option>
						<option value='corporateRelocation'>Corporate Relocation</option>
						<option value='lifestyleAssistance'>Lifestyle Assistance</option>
					</select>
				</div>

				<div>
					<label htmlFor='moveTiming' className='block text-[14px] font-medium text-charcoal mb-1.5'>
						When do you plan to move?
					</label>
					  <select id='moveTiming' name='moveTiming' value={formState.moveTiming} onChange={handleChange} required className='w-full px-4 py-3 bg-background-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200'>
						<option value=''>Select time frame</option>
						<option value='asap'>ASAP</option>
						<option value='within_3_months'>Within 3 months</option>
						<option value='3_to_6_months'>3 - 6 months</option>
						<option value='6_to_12_months'>6 - 12 months</option>
						<option value='more_than_12_months'>More than 12 months</option>
						<option value='not_sure'>Not sure</option>
					</select>
				</div>

				<div className='lg:col-span-2'>
					<label htmlFor='planDetails' className='block text-[14px] font-medium text-charcoal mb-1.5'>
						Tell us briefly about your plans
					</label>
					  <textarea id='planDetails' name='planDetails' rows={4} value={formState.planDetails} onChange={handleChange} placeholder='Tell us briefly about your plans (areas, budget, timeline)…' required className='w-full px-4 py-3 bg-background-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-[15px] transition-all duration-200' />
				</div>
			</div>

			<button type='submit' className='w-full bg-primary hover:bg-primary-dark text-charcoal font-semibold px-6 py-3.5 rounded-lg transition-all duration-200 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'>
				Submit
			</button>
		</form>

		{showModal && <ConciergeModal initialOpen={true} onClose={() => setShowModal(false)} />}
		</>
	);
}
