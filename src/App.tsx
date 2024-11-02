import './App.css'
import DashBoard from './components/dashboard/dashboard'
import Navbar from './components/navbar/navbar'
import file from './data/Electric_Vehicle_Population_Data.csv?raw'
import papa from 'papaparse'
import GridViewIcon from '@mui/icons-material/GridView';
import PublicIcon from '@mui/icons-material/Public';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import { Tdata,MenuList } from './types'
import { useEffect, useState } from 'react'

function App() {

  const menuList:MenuList[] = [
    {
        name:'DashBoard',
        icon:<GridViewIcon></GridViewIcon>
    },
    {
        name:'DemoGraphics',
        icon:<PublicIcon></PublicIcon>
    },
    {
        name:'Specifications & Trends',
        icon:<TrendingUpIcon></TrendingUpIcon>
    },
    // {
    //     name:'CAFV Eligibility',
    //     icon:<AllInboxIcon></AllInboxIcon>
    // },
    {
        name:'Range & Price',
        icon:<PriceChangeIcon></PriceChangeIcon>
    },
    // {
    //     name:'Utility insights',
    //     icon:<InsightsIcon></InsightsIcon>
    // },
    // {
    //     name:'Census Tract',
    //     icon:<StackedLineChartIcon></StackedLineChartIcon>
    // },
]

const [menu,setMenu] = useState(menuList[0].name);

  const [data,setData] = useState([] as Tdata[]);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    readCsv();
  } ,[])
  
  if(loading){
    return <p>loading...</p>
  }

  async function readCsv(){

    papa.parse(file,{
      header:true,
      complete:(res) => {
        let filtered = (res.data as Tdata[]).filter(obj => !(Object.keys(obj).every((key) => !obj[key as keyof Tdata])))
        setData(filtered);
        setLoading(false);
      }
    });
  }

  return (
    <>
    <div className="flex lg:flex-row md:flex-col sm:flex-col max-sm:flex-col overflow-x-hidden">
      <Navbar menu={menu} setMenu={setMenu} menuList={menuList} />
      <DashBoard data={data} menu={menu}/>
    </div>
    </>
  )
}

export default App
