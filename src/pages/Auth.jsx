import Login from "./components/Login";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function Auth() {
  return (
    <div 
      className='h-screen w-full'
      style={{
        backgroundColor: '#253a5e'
      }}
    >
      {/* Navbar with logo */}
      <div className='w-full p-6'>
        <img 
          className='h-12 w-auto object-contain' 
          src="https://images.squarespace-cdn.com/content/v1/66ab323e41a92509a1599122/3fcf8d88-5733-407f-a93b-0d3d3932b096/Bellwether+Logo+SVG+1.png?format=1500w" 
          alt="Bellwether Logo" 
        />
      </div>
      
      {/* Login form centered */}
      <div className='flex justify-center items-center h-[calc(100vh-120px)]'>
        <div className="w-[400px]">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader>  
              <CardTitle className='font-messina-mono uppercase font-bold text-2xl text-center'>Login</CardTitle>
              <CardDescription className='text-center'>
                Head toward your dashboard by entering your login credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Login/>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Auth