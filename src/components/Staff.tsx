interface StaffProps {
    onBack: () => void;
}

const GiftStaff: React.FC<StaffProps> = ({ onBack }) => {
    return (
        <div className="flex flex-col justify-center items-center bg-phone bg-contain font-prompt min-h-screen p-4">
            <img src="/secret/Oat.png" alt="Gift Staff" className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-md mb-4" />
            <h1 className="text-center text-lg sm:text-xl md:text-2xl">สตาฟทุกคนเก่งมากก</h1>
            <h1 className="text-center text-lg sm:text-xl md:text-2xl">วันนี้วันสุดท้ายแล้ว</h1>
            <h1 className="text-center text-lg sm:text-xl md:text-2xl mb-4">สู้ ๆ ฮ้าฟฟฟ</h1>
            <button
                className="mt-4 px-4 py-2 bg-white text-amber-900 font-semibold rounded-lg focus:outline-none"
                onClick={onBack}
            >
                Back
            </button>
        </div>
    );
}

export default GiftStaff;
