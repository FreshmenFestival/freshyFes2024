
interface StaffProps {
    onBack: () => void;
  }


const GiftStaff: React.FC<StaffProps> = ({ onBack }) => {
    return(
        <div className="bg-phone bg-contain">
            <img/>
            <h1>สตาฟทุกคนเก่งมากก</h1>
            <h1>วันนี้วันสุดท้ายแล้ว</h1>
            <h1>สู้ ๆ ฮ้าฟฟฟ</h1>
            <button className="mt-4 px-6 py-2 bg-white-50 text-center text-sm text-amber-900 font-prompt font-semibold mb-6 
                rounded-lg focus:outline-none" onClick={onBack}> Back </button>
        </div>
        
    );
}
export default GiftStaff;