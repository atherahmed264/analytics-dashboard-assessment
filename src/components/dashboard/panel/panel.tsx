import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import EmojiSymbolsIcon from '@mui/icons-material/EmojiSymbols';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';
import { ResponsivePie } from '@nivo/pie'
import { Tdata } from '../../../types';


export default function Panel({ data }:{ data:Tdata[]}) {

    let { total ,avgERange ,cafvPercent ,avgPrice ,top10 ,topmake} = getCardData(data);

    let sum = topmake.reduce((acc,val) => acc + val.val ,0);
    let others = total - sum;
    let dataForChart = topmake.map(x => ({ id: x.name, label:x.name, value:x.val}));
    sessionStorage.setItem("topMakes",JSON.stringify(dataForChart));
    dataForChart.push({
        id:'Others',
        label:'Others',
        value:others
    })
    const chart = MyResponsivePie({ data:dataForChart});

    const cards = [
        {
            name:"Total Vehicles",
            value:total.toLocaleString(),
            icon:<ElectricCarIcon/>
        },
        {
            name:"Average Electric Range",
            value:avgERange.toFixed(2),
            icon:<ElectricalServicesIcon/>
        },
        {
            name:"CAFV Eligibility %",
            value:cafvPercent.toFixed(2),
            icon:<EmojiSymbolsIcon/>
        },
        {
            name:"Average MSRP $",
            value:avgPrice.toLocaleString(),
            icon:<AccountBalanceIcon/>
        },
        {
            name:"Top Vehicle Make",
            value:topmake[0].name,
            icon:<AirlineStopsIcon/>
        },
    ]

    return (
        <>
            <h4 className="text-2xl mx-4 mb-4">Overview <p className='text-sm'>( Click on Menu items to see more Analytics )</p> </h4>

            <div className="flex gap-6 items-center mx-4 flex-wrap ">
                {   
                    cards.map(item => 

                        <div key={item.name}
                        className="card bg-orange-50 w-[200px] h-28 rounded-lg flex flex-col justify-center items-center hover:cursor-pointer shadow-md">
                            {item.icon}
                            <h3 className="text-md">{item.name}</h3>
                            <p className='text-xl'>{item.value}</p>
                        </div>
                    )
                }
                
            </div>
            <h4 className='text-2xl mx-4 mb-4 mt-4'>Top Models & Companies</h4>
            <div className='flex flex-wrap gap-10 mx-4 mt-5'>
                <div className="table">
                    <table className='min-w-full bg-white border border-gray-200 rounded-md shadow-md'>
                        <thead>
                            <tr className='bg-orange-50 border-b-2 border-b-black text-gray-600 uppercase text-sm leading-normal'>
                                <th className='py-3 px-6 text-left'>
                                    Name
                                </th>
                                <th className='py-3 px-6 text-left'>
                                    Year
                                </th>
                                <th className='py-3 px-6 text-left'>
                                    Vehicle Count
                                </th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-700 text-sm font-light'>
                            { top10.map((car,index) => 

                                <tr className={`border-b border-gray-200 hover:bg-orange-50 ${
                                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                                    key={index}
                                >
                                    <td className='py-3 px-6'> { car.name }</td>
                                    <td className='py-3 px-6'> { car.year } </td>
                                    <td className='py-3 px-6'> { car.val }</td>
                                </tr>
                            )
                            }
                        </tbody>
                    </table>
                </div>
                <div className="chart h-[20rem] lg:w-[40rem] md:w-full sm:w-full max-sm:w-full bg-orange-50 shadow-md rounded-md">
                   { dataForChart && chart}
                </div>
            </div>
        </>
    )
}

function getCardData(data:Tdata[]){
    let total = data.length;

    let electricRange = [];
    let totalrange = 0;
    
    let cafv = 0;
    
    let prices = []
    let totalPrice = 0;

    let carObj:{[key:string]:number} = {};
    let yearObj:{[key:string]:string} = {};
    let makeObj:{[key:string]:number} ={};
    
    for(let car of data){
        if(parseInt(car['Electric Range'])){
            electricRange.push(car);
            totalrange += parseFloat(car['Electric Range']);
        }

        if(car['Clean Alternative Fuel Vehicle (CAFV) Eligibility'] &&
            car['Clean Alternative Fuel Vehicle (CAFV) Eligibility'].toLowerCase().includes('vehicle eligible')
        ){
            cafv++
        }

        if(car['Base MSRP'] && parseFloat(car['Base MSRP'])){
            prices.push(car);
            totalPrice += parseFloat(car['Base MSRP']);
        }

        carObj[car.Make + " " +car.Model] = carObj[car.Make + " " + car.Model] ? carObj[car.Make + " " + car.Model] + 1 : 1;

        yearObj[car.Make + " " +car.Model] = yearObj[car.Make + " " +car.Model] ?? car['Model Year'];

        makeObj[car.Make] = makeObj[car.Make] ? makeObj[car.Make] + 1 : 1;

    }
    
    let arr = Object.keys(carObj).sort((a,b) => carObj[a] - carObj[b]).map(x => ({ name:x , val:carObj[x]?.toLocaleString() ,year:yearObj[x] })).splice(-6);
    let makeArr = Object.keys(makeObj).sort((a,b) => makeObj[a] - makeObj[b]).map(x => ({ name:x , val:makeObj[x] }));
    let top10 =  arr.reverse();
    sessionStorage.setItem('top10makes',JSON.stringify(makeArr.slice(-10)))
    let topmake = makeArr.splice(-5).reverse();
    let cafvPercent = (cafv / total) * 100
    let avgERange = totalrange / electricRange.length;
    let avgPrice = totalPrice / prices.length;

    return {
        total,
        avgERange,
        cafvPercent,
        avgPrice,
        top10,
        topmake
    }
}

// { data:{ id:string,label:string,value:number,color:string}}

const MyResponsivePie = ({ data }:any) => (
    <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        colors={{scheme:'nivo'}}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    0.2
                ]
            ]
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    2
                ]
            ]
        }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'ruby'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'c'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'go'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'python'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'scala'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'lisp'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'elixir'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'javascript'
                },
                id: 'lines'
            }
        ]}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />
)