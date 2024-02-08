import AdminSide from "../../Components/admin_components/admin_side";
import AdminNav from "../../Components/admin_components/admin_nav";
import { useEffect,useState } from "react";
import { baseUrl,reported_items } from "../../utilits/constants";
import axios from "axios";
import Swal from "sweetalert2";

const Reportpage =() =>{
    const[reportlist,setReportlist]=useState([]);
    const [trigger,setTrigger]=useState(false)

const handleBlockItem = async (reportedItemId,reportType) =>{
  try{
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });
    if(result.isConfirmed){
      const token = localStorage.getItem('jwtTokenAdmin');
      const formData = new FormData();

      formData.append('reported_item_id', reportedItemId);
      formData.append('report_type', reportType);
     
    

      const response = await axios.patch(`${baseUrl}/api/block-item/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire("Blocked!", " post has been Blocked.", "success");
      setTrigger(true)
    }
    
  }catch (error) {
    console.error('Error Blocking:', error.response.data.error);
    // Handle errors or display error messages to the user
    Swal.fire("Error", "An error occurred while blocking the post.", "error");
  
  }
}

    const handleDeleteReport = async (reportedItemId, reportType) => {
      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
        });

        if (result.isConfirmed) {
          const token = localStorage.getItem('jwtTokenAdmin');
          console.log('Token:', token);

        const response = await axios.post(`${baseUrl}/api/delete_reports/`, { reported_item_id: reportedItemId, report_type: reportType },
        { headers: { Authorization: `Token ${token}` } }
        );
        Swal.fire("Deleted!", "Your post has been deleted.", "success");
        setTrigger(true)
      }
        // Assuming you want to update the UI after deletion, you may want to refresh the reportlist
        // You can fetch the updated reportlist here or use state management to trigger a re-render
      } catch (error) {
        console.error('Error deleting report:', error.response.data.error);
        // Handle errors or display error messages to the user
        Swal.fire("Error", "An error occurred while deleting the post.", "error");
      
      }
    };

   

    const fetchData = async () => {
        try {
          const token = localStorage.getItem('jwtTokenAdmin');
          console.log('Token:', token);
    
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
    
          console.log('Making request...new');
          const response = await axios.get(baseUrl + reported_items, config);
          console.log(response.data,"response");
          setReportlist(response.data.reported_items);
        } catch (error) {
          console.error('Error:', error);
    
        }};
    
      useEffect(() => {
        
        fetchData();
        
      }, [trigger]);


    

    return (
        <div class="flex">
        {/* <!-- AdminSide component --> */}
        <div class="hidden lg:block ">
            <AdminSide />
        </div>
    
        {/* <!-- AdminNav component --> */}
        <div class="hidden lg:block w-1/4">
            <AdminNav />
        </div>
{/*     
        <!-- Table Section --> */}
        <div class="lg:flex lg:flex-col lg:items-center lg:justify-center w-full mt-24">
            <table class="table-auto mr-24">
                <thead>
                    <tr>
                        <th class="px-4 py-2">Item</th>
                        <th class="px-4 py-2">Report Count</th>
                        <th class="px-4 py-2">Reasons</th>
                        <th class="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reportlist ? reportlist.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="border px-4 py-2" style={{ width: '200px', height: '150px' }}><img src={`${baseUrl}${item.item_details.media}`} alt="Media" /></td>
                        <td className="border px-4 py-2">{item.report_count}</td>
                        <td className="border px-4 py-2">
                          <ul className="list-disc">
                            {item.reasons.map((reason, i) => (
                              <li key={i} className="whitespace-normal break-words">
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="border px-4 py-2  flex-col space-y-2">
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                            onClick={() => handleDeleteReport(item.reported_item_id,item.report_type)}
                          >
                            Delete Report
                          </button>
                          {item.item_details.is_blocked ? (
                                  <span>Blocked</span>
                                ) : (
                                  <button
                                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleBlockItem(item.reported_item_id,item.report_type)}
                                  >
                                    Block Item
                                  </button>
                                )}
                        </td>
                      </tr>
                    )):""}
                    </tbody>
            </table>
        </div>
    </div>
    
      );
    };
    
    export default Reportpage;