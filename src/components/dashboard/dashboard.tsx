import './dashboard.css'
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import Panel from './panel/panel';
import { MenuItem, Tdata } from '../../types';
import { Trends } from './trends/trends';
import { DemoGraphics } from './demographics/demo';
import { Prices } from './price/prices';


export default function DashBoard({ data,menu }:{ data:Tdata[],menu:MenuItem}) {

    function getComponent(){
        switch(menu){
            case 'DashBoard':
                return <Panel data={data} />
            case 'DemoGraphics':     
                return <DemoGraphics data={data}/>
           case 'Specifications & Trends':
                return <Trends data={data}/>
           case 'Range & Price':     
                return <Prices data={data}/>
           default:
                return <Panel data={data} />
        }
    }

    return (
        <>
            <section
                className='lg:h-[100vh] lg:w-[80vw] lg:mt-0 
            md:w-[100vw]  md:h-[100vh]
            sm:w-[100vw]  sm:h-[100vh]
            max-sm:w-[100vw] max-sm:h-[100vh]
            bg-orange-100 overflow-auto bg-clip-padding'>
                <div className="flex items-center justify-between mx-5 my-2 pb-4 border-b-2 border-b-black flex-wrap mb-6">
                    <h2 className='text-4xl'>Dashboard</h2>
                    <div className="flex gap-5 flex-wrap">
                        <div className="relative w-64">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                className="pl-10 pr-3 py-3 border border-gray-300 rounded-r-full rounded-l-full w-full focus:outline-none focus:border-blue-500"
                                placeholder="Search Anything Here"
                            />
                        </div>
                        <button className='bg-white rounded-full w-12'>
                            <NotificationsIcon /> 
                        </button>
                        <button className='flex justify-center items-center gap-2 bg-white p-3 rounded-l-full rounded-r-full'>
                            <PersonIcon />
                            <p>userName</p>
                        </button>
                    </div>
                </div>
                {getComponent()}
            </section>
        </>
    )
}