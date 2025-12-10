// "use client";

// import { useState } from "react";
// import { X } from "lucide-react";

// export default function AddPropertyModal({ isOpen, onClose }) {
//     const [title, setTitle] = useState("");
//     const [type, setType] = useState("");
//     const [units, setUnits] = useState("");
//     const [location, setLocation] = useState("");
//     const [price, setPrice] = useState("");
//     const [bedrooms, setBedrooms] = useState("");
//     const [bathrooms, setBathrooms] = useState("");
//     const [area, setArea] = useState("");
//     const [amenities, setAmenities] = useState([]);
//     const [photos, setPhotos] = useState([]);
//     const [video, setVideo] = useState(null);
//     const [editImages, setEditImages] = useState(false);
//     const [ownership, setOwnership] = useState(null);
//     const [logo, setLogo] = useState(null);

//     if (!isOpen) return null;

//     const amenityOptions = [
//         "Pool",
//         "Parking",
//         "Gym",
//         "Garden",
//         "Security",
//         "Elevator",
//         "Air Conditioning",
//     ];

//     const toggleAmenity = (name) => {
//         setAmenities((prev) =>
//             prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
//         );
//     };

//     const handlePhotos = (e) => {
//         const files = Array.from(e.target.files).slice(0, 20);
//         setPhotos(files);
//     };

//     const handleVideo = (e) => {
//         setVideo(e.target.files[0] || null);
//     };

//     const handleLogo = (e) => {
//         setLogo(e.target.files[0] || null);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Client-only submission for dev: log the payload
//         const payload = {
//             title,
//             type,
//             units,
//             location,
//             price,
//             bedrooms,
//             bathrooms,
//             area,
//             amenities,
//             photosCount: photos.length,
//             hasVideo: !!video,
//             editImages,
//             ownership,
//             logoName: logo?.name || null,
//         };
//         console.log("AddProperty payload:", payload);
//         alert("Property saved locally (dev). Check console for payload.");
//         // Reset and close
//         onClose();
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//             <div
//                 className="absolute inset-0 bg-black/40"
//                 onClick={onClose}
//                 aria-hidden
//             />

//             <div className="relative z-10 w-full max-w-full sm:max-w-3xl max-h-[90vh] px-4 sm:px-0">
//                 <form
//                     onSubmit={handleSubmit}
//                     className="flex max-h-[calc(100vh-4rem)] flex-col overflow-hidden rounded-lg bg-white shadow-lg"
//                 >
//                     {/* Header - sticky */}
//                     <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-white p-4 sm:p-4">
//                         <h3 className="text-lg font-semibold">Add Property</h3>
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="rounded p-1 text-gray-600 hover:bg-gray-100"
//                             aria-label="Close"
//                         >
//                             <X className="h-5 w-5" />
//                         </button>
//                     </div>

//                     {/* Body - scrollable */}
//                     <div className="overflow-auto p-4 sm:p-6">
//                         <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//                             <div className="col-span-2">
//                                 <label className="block text-sm font-medium">Property Title</label>
//                                 <input
//                                     required
//                                     value={title}
//                                     onChange={(e) => setTitle(e.target.value)}
//                                     className="mt-1 w-full rounded border px-3 py-2 text-sm"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium">Property Type (required)</label>
//                                 <select
//                                     required
//                                     value={type}
//                                     onChange={(e) => setType(e.target.value)}
//                                     className="mt-1 w-full rounded border px-3 py-2 text-sm"
//                                 >
//                                     <option value="">Select type</option>
//                                     <option>Apartment</option>
//                                     <option>Villa</option>
//                                     <option>House</option>
//                                     <option>Land</option>
//                                     <option>Duplex</option>
//                                     <option>Studio</option>
//                                     <option>Commercial</option>
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium">Number of Units (if applicable)</label>
//                                 <input
//                                     value={units}
//                                     onChange={(e) => setUnits(e.target.value)}
//                                     className="mt-1 w-full rounded border px-3 py-2 text-sm"
//                                     placeholder="e.g. 10"
//                                 />
//                             </div>

//                             <div className="col-span-2">
//                                 <label className="block text-sm font-medium">Location (Google-style)</label>
//                                 <input
//                                     required
//                                     value={location}
//                                     onChange={(e) => setLocation(e.target.value)}
//                                     placeholder="Start typing an address or drop a pin"
//                                     className="mt-1 w-full rounded border px-3 py-2 text-sm"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium">Price / Rent</label>
//                                 <input
//                                     value={price}
//                                     onChange={(e) => setPrice(e.target.value)}
//                                     className="mt-1 w-full rounded border px-3 py-2 text-sm"
//                                     placeholder="e.g. 450000"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium">Bedrooms</label>
//                                 <input
//                                     value={bedrooms}
//                                     onChange={(e) => setBedrooms(e.target.value)}
//                                     className="mt-1 w-full rounded border px-3 py-2 text-sm"
//                                     placeholder="e.g. 3"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium">Bathrooms</label>
//                                 <input
//                                     value={bathrooms}
//                                     onChange={(e) => setBathrooms(e.target.value)}
//                                     className="mt-1 w-full rounded border px-3 py-2 text-sm"
//                                     placeholder="e.g. 2"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium">Square Meters</label>
//                                 <input
//                                     value={area}
//                                     onChange={(e) => setArea(e.target.value)}
//                                     className="mt-1 w-full rounded border px-3 py-2 text-sm"
//                                     placeholder="e.g. 120"
//                                 />
//                             </div>

//                             <div className="col-span-2">
//                                 <label className="block text-sm font-medium">Amenities (multi-select)</label>
//                                 <div className="mt-1 flex flex-wrap gap-2">
//                                     {amenityOptions.map((a) => (
//                                         <button
//                                             key={a}
//                                             type="button"
//                                             onClick={() => toggleAmenity(a)}
//                                             className={`rounded border px-2 py-1 text-sm ${amenities.includes(a) ? 'bg-[#E6B325] text-black' : 'bg-white text-gray-700'}`}
//                                         >
//                                             {a}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div className="col-span-2">
//                                 <label className="block text-sm font-medium">Upload Photos (15+)</label>
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     multiple
//                                     onChange={handlePhotos}
//                                     className="mt-1 w-full text-sm"
//                                 />
//                                 <div className="mt-1 text-xs text-gray-500">Selected: {photos.length} files</div>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium">Upload Video (optional)</label>
//                                 <input type="file" accept="video/*" onChange={handleVideo} className="mt-1 w-full text-sm" />
//                                 <div className="mt-1 text-xs text-gray-500">{video ? video.name : 'No video selected'}</div>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium">Do you want Q Homes to edit/enhance your images?</label>
//                                 <div className="mt-1 flex gap-3">
//                                     <label className="inline-flex items-center gap-2"><input type="radio" name="editImages" checked={editImages === true} onChange={() => setEditImages(true)} /> Yes</label>
//                                     <label className="inline-flex items-center gap-2"><input type="radio" name="editImages" checked={editImages === false} onChange={() => setEditImages(false)} /> No</label>
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium">Ownership / Authorization</label>
//                                 <div className="mt-1 flex gap-3">
//                                     <label className="inline-flex items-center gap-2"><input type="radio" name="ownership" checked={ownership === 'yes'} onChange={() => setOwnership('yes')} /> Yes</label>
//                                     <label className="inline-flex items-center gap-2"><input type="radio" name="ownership" checked={ownership === 'no'} onChange={() => setOwnership('no')} /> No</label>
//                                 </div>
//                             </div>

//                             <div className="col-span-2">
//                                 <label className="block text-sm font-medium">Optional: Add Developer/Agency Logo</label>
//                                 <input type="file" accept="image/*" onChange={handleLogo} className="mt-1 w-full text-sm" />
//                                 <div className="mt-1 text-xs text-gray-500">{logo ? logo.name : 'No logo selected'}</div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Footer - sticky */}
//                     <div className="sticky bottom-0 z-10 flex flex-col gap-2 border-t bg-white p-4 sm:flex-row sm:justify-end sm:gap-2 sm:px-6">
//                         <div className="flex justify-end gap-2 w-full sm:w-auto">
//                             <button type="button" onClick={onClose} className="rounded border px-4 py-2 text-sm">Cancel</button>
//                             <button type="submit" className="rounded bg-[#E6B325] px-4 py-2 text-sm font-semibold text-black">Save Property</button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }














"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function AddPropertyModal({ isOpen, onClose }) {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [units, setUnits] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [area, setArea] = useState("");
    const [amenities, setAmenities] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [video, setVideo] = useState(null);
    const [editImages, setEditImages] = useState(false);
    const [ownership, setOwnership] = useState(null);
    const [logo, setLogo] = useState(null);

    if (!isOpen) return null;

    const amenityOptions = [
        "Pool",
        "Parking",
        "Gym",
        "Garden",
        "Security",
        "Elevator",
        "Air Conditioning",
    ];

    const toggleAmenity = (name) => {
        setAmenities((prev) =>
            prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
        );
    };

    const handlePhotos = (e) => {
        const files = Array.from(e.target.files).slice(0, 20);
        setPhotos(files);
    };

    const handleVideo = (e) => {
        setVideo(e.target.files[0] || null);
    };

    const handleLogo = (e) => {
        setLogo(e.target.files[0] || null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            title,
            type,
            units,
            location,
            price,
            bedrooms,
            bathrooms,
            area,
            amenities,
            photosCount: photos.length,
            hasVideo: !!video,
            editImages,
            ownership,
            logoName: logo?.name || null,
        };
        console.log("AddProperty payload:", payload);
        alert("Property saved locally (dev). Check console for payload.");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="relative z-10 w-full max-w-full sm:max-w-3xl max-h-[90vh] px-4 sm:px-0">
                <form
                    onSubmit={handleSubmit}
                    className="flex max-h-[calc(100vh-4rem)] flex-col overflow-hidden rounded-lg bg-white shadow-lg"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
                        <h3 className="text-lg font-semibold">Add Property</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded p-1 text-gray-600 hover:bg-gray-100"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="overflow-auto p-4 sm:p-6">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                            <div className="col-span-2">
                                <label className="block text-sm font-medium">Property Title</label>
                                <input
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Property Type (required)</label>
                                <select
                                    required
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                                >
                                    <option value="">Select type</option>
                                    <option>Apartment</option>
                                    <option>Villa</option>
                                    <option>House</option>
                                    <option>Land</option>
                                    <option>Duplex</option>
                                    <option>Studio</option>
                                    <option>Commercial</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Number of Units</label>
                                <input
                                    value={units}
                                    onChange={(e) => setUnits(e.target.value)}
                                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium">Location</label>
                                <input
                                    required
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Price / Rent</label>
                                <input
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Bedrooms</label>
                                <input
                                    value={bedrooms}
                                    onChange={(e) => setBedrooms(e.target.value)}
                                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Bathrooms</label>
                                <input
                                    value={bathrooms}
                                    onChange={(e) => setBathrooms(e.target.value)}
                                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Square Meters</label>
                                <input
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                                />
                            </div>

                            {/* Amenities */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium">Amenities</label>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {amenityOptions.map((a) => (
                                        <button
                                            key={a}
                                            type="button"
                                            onClick={() => toggleAmenity(a)}
                                            className={`rounded border px-2 py-1 text-sm ${
                                                amenities.includes(a)
                                                    ? "bg-[#E6B325] text-black"
                                                    : "bg-white text-gray-700"
                                            }`}
                                        >
                                            {a}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Photos Upload (Box) */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium">Upload Photos</label>

                                <div
                                    onClick={() => document.getElementById("photosInput").click()}
                                    className="mt-1 w-full cursor-pointer rounded border border-dashed border-gray-400 bg-gray-50 p-4 text-center text-sm text-gray-600 hover:bg-gray-100"
                                >
                                    <p className="font-medium">Click to upload photos</p>
                                    <p className="text-xs text-gray-500">(Up to 20 photos allowed)</p>
                                </div>

                                <input
                                    id="photosInput"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handlePhotos}
                                    className="hidden"
                                />

                                <div className="mt-1 text-xs text-gray-500">Selected: {photos.length}</div>
                            </div>

                            {/* Video Upload (Box) */}
                            <div>
                                <label className="block text-sm font-medium">Upload Video</label>

                                <div
                                    onClick={() => document.getElementById("videoInput").click()}
                                    className="mt-1 w-full cursor-pointer rounded border border-dashed border-gray-400 bg-gray-50 p-4 text-center text-sm text-gray-600 hover:bg-gray-100"
                                >
                                    <p className="font-medium">Click to upload video</p>
                                </div>

                                <input
                                    id="videoInput"
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideo}
                                    className="hidden"
                                />

                                <div className="mt-1 text-xs text-gray-500">
                                    {video ? video.name : "No video selected"}
                                </div>
                            </div>

                            {/* Edit Images */}
                            <div>
                                <label className="block text-sm font-medium">Image Editing</label>
                                <div className="mt-1 flex gap-3">
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="editImages"
                                            checked={editImages === true}
                                            onChange={() => setEditImages(true)}
                                        />{" "}
                                        Yes
                                    </label>
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="editImages"
                                            checked={editImages === false}
                                            onChange={() => setEditImages(false)}
                                        />{" "}
                                        No
                                    </label>
                                </div>
                            </div>

                            {/* Ownership */}
                            <div>
                                <label className="block text-sm font-medium">Ownership</label>
                                <div className="mt-1 flex gap-3">
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="ownership"
                                            checked={ownership === "yes"}
                                            onChange={() => setOwnership("yes")}
                                        />{" "}
                                        Yes
                                    </label>
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="ownership"
                                            checked={ownership === "no"}
                                            onChange={() => setOwnership("no")}
                                        />{" "}
                                        No
                                    </label>
                                </div>
                            </div>

                            {/* Logo Upload (Box) */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium">Developer/Agency Logo</label>

                                <div
                                    onClick={() => document.getElementById("logoInput").click()}
                                    className="mt-1 w-full cursor-pointer rounded border border-dashed border-gray-400 bg-gray-50 p-4 text-center text-sm text-gray-600 hover:bg-gray-100"
                                >
                                    <p className="font-medium">Click to upload logo</p>
                                </div>

                                <input
                                    id="logoInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogo}
                                    className="hidden"
                                />

                                <div className="mt-1 text-xs text-gray-500">
                                    {logo ? logo.name : "No logo selected"}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 flex flex-col gap-2 border-t bg-white p-4 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded border px-4 py-2 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded bg-[#E6B325] px-4 py-2 text-sm font-semibold text-black"
                        >
                            Save Property
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
