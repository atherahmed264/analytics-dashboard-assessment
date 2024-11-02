import './navbar.css';
import { useState } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import HelpIcon from '@mui/icons-material/Help';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export default function Navbar({ menu, setMenu,menuList}:any){

   
    const [open,setOpen] = useState(false);


    function handleToggle(){
        setOpen(prev => !prev);
    }

    function handleMenuChange(menu:string){
        setMenu(menu);
        setOpen(false);
    }

    return (
        <>
            <section className={`bg-slate-900 overflow-hidden lg:w-[20vw] lg:h-[100vh] md:w-[100vw] !md:h-[${ open ? '100vh' : '80px'}]  sm:w-[100vw] !sm:h-[${ open ? '100vh' : '80px'}] max-sm:w-[100vw] !max-sm:h-[${ open ? '100vh' : '80px'}] text-white`}>
                <div 
                className={`flex flex-col justify-start items-center ${ open ? 'max-h-[100vh]' : 'max-h-[80px]' }`}>
                    <div className="logo flex justify-center items-center mt-5 gap-3">
                        <DashboardIcon></DashboardIcon>
                        <h2 className='text-2xl'>Dashboard Logo</h2>
                        <button onClick={handleToggle} 
                        className='lg:hidden md:block sm:block ml-5'>{open ? <CloseIcon/> : <MenuIcon/>}</button>
                    </div>
                    <button 
                    className='flex justify-center items-center mt-8 mb-8 p-4 gap-2 bg-white rounded-r-full rounded-l-full'>
                        <AddIcon className='bg-orange-600 rounded-full'></AddIcon>
                        <h3 className='text-slate-900'>Add new Dataset</h3>
                    </button>
          
                    <div className='flex flex-col justify-start items-center gap-2   '>
                    {
                        menuList.map((item:{name:string,icon:JSX.Element}) => 
                            <button key={item.name} onClick={() => handleMenuChange(item.name)} 
                            className={`flex flex-row justify-center items-center gap-4 pl-2 pr-5 py-2 rounded-r-full rounded-l-full transition-all duration-500 ease-in-out
                                ${menu == item.name ? 'bg-white text-orange-600' : 'bg-none text-white'}`}>
                                {item.icon}
                                <h3>{item.name}</h3>
                            </button>
                        )
                    }
                    </div>
                </div>
                <button className='rounded-full fixed bottom-0 bg-orange-600 p-3 m-4'>
                    <HelpIcon/>
                </button>
            </section>
        </>
    )
}