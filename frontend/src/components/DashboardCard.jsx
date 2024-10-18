const DashboardCard = ({ title, value, color }) => {
    return (
      <div className={`p-4 ${color} rounded-lg shadow-lg text-white`}>
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-2xl mt-2">{value}</p>
      </div>
    );
  };
  
  export default DashboardCard;
  