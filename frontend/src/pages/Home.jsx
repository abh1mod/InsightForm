import { Link } from "react-router-dom";
import { useAppContext } from "../context/ContextAPI";

const Home = () => {
    const { isLoggedIn } = useAppContext();

    const getStartedLink = isLoggedIn ? "/dashboard" : "/login";

    return (
        <div className="min-h-screen w-full overflow-x-hidden">
            {/* Hero Section with Background */}
            <section className="relative min-h-screen flex items-center justify-center bg-blue-100 w-full">
                {/* Exact Background Pattern from Image */}
                <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-gray-50 to-blue-50">
                    {/* Smart Forms Feature - Top Left */}
                    <div className="absolute top-16 left-12 w-32 h-32 opacity-60">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            {/* Document outline */}
                            <rect x="20" y="20" width="120" height="140" rx="8" fill="none" stroke="#60a5fa" strokeWidth="2"/>
                            <line x1="30" y1="40" x2="130" y2="40" stroke="#60a5fa" strokeWidth="1.5"/>
                            <line x1="30" y1="60" x2="110" y2="60" stroke="#60a5fa" strokeWidth="1.5"/>
                            <line x1="30" y1="80" x2="120" y2="80" stroke="#60a5fa" strokeWidth="1.5"/>
                            {/* Circuit board overlay */}
                            <rect x="100" y="100" width="40" height="40" fill="#60a5fa" opacity="0.3"/>
                            <rect x="110" y="110" width="20" height="20" fill="#60a5fa" opacity="0.6"/>
                            <line x1="110" y1="110" x2="130" y2="110" stroke="#60a5fa" strokeWidth="1"/>
                            <line x1="110" y1="130" x2="130" y2="130" stroke="#60a5fa" strokeWidth="1"/>
                            <line x1="110" y1="110" x2="110" y2="130" stroke="#60a5fa" strokeWidth="1"/>
                            <line x1="130" y1="110" x2="130" y2="130" stroke="#60a5fa" strokeWidth="1"/>
                        </svg>
                        <div className="text-center mt-2">
                            <span className="text-sm font-medium text-gray-700">Smart Forms</span>
                        </div>
                    </div>
                    
                    {/* Statistics Feature - Bottom Left */}
                    <div className="absolute bottom-24 left-12 w-32 h-32 opacity-60">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlSpace="preserve"
                            id="Layer_1"
                            width="200"
                            height="120"
                            fill="#000"
                            version="1.1"
                            viewBox="0 0 512 512"
                        >
                            <g id="SVGRepo_iconCarrier">
                            <circle cx="256" cy="256" r="256" fill="#21D0C3"></circle>
                            <path
                                fill="#666"
                                d="M163.918 73.864h184.164a5.266 5.266 0 0 1 5.266 5.266v353.746a5.266 5.266 0 0 1-5.266 5.266H163.918a5.266 5.266 0 0 1-5.266-5.266V79.129a5.266 5.266 0 0 1 5.266-5.265"
                            ></path>
                            <path
                                fill="#FFF"
                                d="M171.989 123.022h168.022a4.09 4.09 0 0 1 4.09 4.09v257.773a4.09 4.09 0 0 1-4.09 4.09H171.989a4.09 4.09 0 0 1-4.09-4.09V127.112a4.09 4.09 0 0 1 4.09-4.09"
                            ></path>
                            <g fill="#C0C1C4">
                                <path d="M211.781 96.353h88.432a3.678 3.678 0 0 1 0 7.356H211.78a3.68 3.68 0 0 1-3.678-3.678 3.68 3.68 0 0 1 3.679-3.678"></path>
                                <circle cx="255.271" cy="414.65" r="12.213"></circle>
                                <circle cx="182.903" cy="100.334" r="4.171"></circle>
                            </g>
                            <path fill="#21D0C3" d="M222.744 316.489h23.617v63.309h-23.617z"></path>
                            <path fill="#FAD24D" d="M265.64 253.241h23.612v126.562H265.64z"></path>
                            <path fill="#21D0C3" d="M308.536 198.127h23.612v181.676h-23.612z"></path>
                            <path fill="#FAD24D" d="M179.847 290.987h23.612v88.817h-23.612z"></path>
                            <path
                                fill="#FF5B62"
                                d="M192.534 236.431c5.886 0 10.654 4.768 10.654 10.654q-.001 1.073-.209 2.09l18.645 10.635a10.63 10.63 0 0 1 7.73-3.323c1.464 0 2.857.289 4.128.829l28.712-61.295a10.63 10.63 0 0 1-4.369-8.607c0-5.887 4.768-10.654 10.654-10.654 2.014 0 3.895.559 5.502 1.531l34.385-28.333a10.6 10.6 0 0 1-1.948-6.147c0-5.886 4.768-10.654 10.654-10.654s10.654 4.768 10.654 10.654-4.768 10.654-10.654 10.654c-2.138 0-4.133-.631-5.797-1.716l-34.214 28.347a10.58 10.58 0 0 1 2.076 6.318c0 5.887-4.773 10.654-10.654 10.654-.914 0-1.805-.119-2.654-.331l-28.967 61.84a10.63 10.63 0 0 1 3.157 7.569c0 5.887-4.768 10.654-10.654 10.654s-10.654-4.768-10.654-10.654c0-1.388.27-2.716.749-3.929l-18.015-10.27a10.64 10.64 0 0 1-8.901 4.797c-5.887 0-10.654-4.768-10.654-10.654s4.768-10.654 10.654-10.654zm124.539-99.054a6.436 6.436 0 1 1-6.436 6.436 6.43 6.43 0 0 1 6.436-6.436m-48.594 43.603a6.436 6.436 0 0 1 0 12.872 6.43 6.43 0 0 1-6.436-6.436 6.436 6.436 0 0 1 6.436-6.436m-39.124 79.726a6.435 6.435 0 0 1 6.436 6.436 6.435 6.435 0 0 1-6.436 6.436 6.43 6.43 0 0 1-6.436-6.436 6.436 6.436 0 0 1 6.436-6.436m-36.821-20.062a6.43 6.43 0 0 1 6.436 6.436 6.435 6.435 0 0 1-6.436 6.436 6.436 6.436 0 0 1 0-12.872"
                            ></path>
                            </g>
                        </svg>
                        <div className="text-center mt-2">
                            <span className="text-sm font-medium text-gray-700">Statistics</span>
                        </div>
                    </div>
                    
                    {/* AI-Powered Analytics Feature - Top Right */}
                    <div className="absolute top-16 right-12 w-32 h-32 opacity-60">
                        <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    id="Layer_1"
    fill="#000"
    version="1.1"
    viewBox="0 0 511.997 511.997"
  >
    <g id="SVGRepo_iconCarrier">
      <circle cx="255.999" cy="255.999" r="255.999" fill="#FAD24D"></circle>
      <ellipse
        cx="255.999"
        cy="421.644"
        fill="#EDB937"
        rx="182.283"
        ry="14.369"
      ></ellipse>
      <path
        fill="#666"
        d="M65.982 67.222h380.036c12.486 0 22.7 10.217 22.7 22.703V324.03H43.282V89.925c0-12.486 10.214-22.703 22.7-22.703"
      ></path>
      <path
        fill="#21D0C3"
        d="M58.695 308.614h394.607V89.922c0-3.979-3.308-7.287-7.287-7.287H65.979c-3.976 0-7.287 3.308-7.287 7.287v218.693h.003z"
      ></path>
      <g fill="#FFF">
        <path d="M468.718 324.03v24.826c0 12.489-11.261 22.703-25.026 22.703H68.305c-13.765 0-25.026-10.214-25.026-22.703V324.03h425.43899999999996M141.238 115.528h263.69c4.142 0 7.528 3.389 7.528 7.528v185.56099999999998H99.546V123.056c0-4.142 3.386-7.528 7.528-7.528h34.167z"></path>
      </g>
      <path
        fill="#828282"
        d="M107.071 115.528h297.858c4.142 0 7.528 3.386 7.528 7.528v15.054H99.546v-15.054c0-4.142 3.386-7.528 7.528-7.528z"
      ></path>
      <path
        fill="#FFF"
        d="M226.384 123.325h163.62c1.115 0 2.022.913 2.022 2.022v3.751a2.03 2.03 0 0 1-2.022 2.022h-163.62a2.03 2.03 0 0 1-2.02-2.022v-3.751a2.026 2.026 0 0 1 2.02-2.022"
      ></path>
      <path
        fill="#21D0C3"
        d="M117.332 121.983a4.333 4.333 0 1 1 0 8.668 4.335 4.335 0 1 1 0-8.668"
      ></path>
      <path
        fill="#EDB937"
        d="M134.44 121.983a4.33 4.33 0 0 1 4.334 4.334 4.333 4.333 0 1 1-8.668 0 4.33 4.33 0 0 1 4.334-4.334"
      ></path>
      <g fill="#FF5B62">
        <path d="M151.552 121.983a4.333 4.333 0 1 1 0 8.668 4.335 4.335 0 1 1 0-8.668M245.195 224.356h24.228l-58.622 84.258h-24.227z"></path>
      </g>
      <path
        fill="#ED4C54"
        d="M269.424 224.355h-24.229l38.973 56.014h24.229l-38.97-56.014z"
      ></path>
      <path
        fill="#FF5B62"
        d="m368.479 194.066-60.085 86.305h-24.229l63.029-90.866-24.58-6.457 66.613-26.215-3.879 42.765z"
      ></path>
      <path
        fill="#DCE3DB"
        d="M179.936 157.805h75.091v3.722h-75.091zm0 8.643h53.814v3.722h-53.814z"
      ></path>
      <path fill="#EDB937" d="M117.18 207.873h9.091v25.716h-9.091z"></path>
      <path fill="#FF5B62" d="M136.373 185.686h9.091v47.901h-9.091z"></path>
      <path fill="#21D0C3" d="M155.565 157.961h9.091v75.632h-9.091z"></path>
      <circle cx="255.999" cy="346.801" r="7.814" fill="#B6B6B8"></circle>
      <path
        fill="#C2C2C4"
        d="m305.065 407.271 36.095 11.564H170.836l29.123-11.564v-35.712h105.104v35.712z"
      ></path>
      <path fill="#B0B0B0" d="m305.065 407.271-105.104-35.712h105.104z"></path>
      <path
        fill="#ECF0F1"
        d="M199.959 407.271h105.104l36.095 11.564v4.981H170.834v-4.981l29.123-11.564z"
      ></path>
      <path
        fill="#DCE3DB"
        d="M179.936 176.127h75.091v3.722h-75.091zm0 8.643h53.814v3.722h-53.814z"
      ></path>
    </g>
  </svg>
                        <div className="text-center mt-2">
                            <span className="text-sm font-medium text-gray-700">AI-Powered Analytics</span>
                        </div>
                    </div>
                    
                    {/* Actionable Insights Feature - Bottom Right */}
                    <div className="absolute bottom-24 right-12 w-32 h-32 opacity-60">
                        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" enableBackground="new 0 0 32 32" xmlSpace="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#31CFFF" d="M29,23.5c0,0.28-0.22,0.5-0.5,0.5H28v0.5c0,0.28-0.22,0.5-0.5,0.5S27,24.78,27,24.5V24h-0.5 c-0.28,0-0.5-0.22-0.5-0.5s0.22-0.5,0.5-0.5H27v-0.5c0-0.28,0.22-0.5,0.5-0.5s0.5,0.22,0.5,0.5V23h0.5C28.78,23,29,23.22,29,23.5z"></path> <path fill="#5FFFBA" d="M8,24.5C8,24.78,7.78,25,7.5,25H6v1.5C6,26.78,5.78,27,5.5,27S5,26.78,5,26.5V25H3.5C3.22,25,3,24.78,3,24.5 S3.22,24,3.5,24H5v-1.5C5,22.22,5.22,22,5.5,22S6,22.22,6,22.5V24h1.5C7.78,24,8,24.22,8,24.5z"></path> <path fill="#5FFFBA" d="M30,5.5C30,5.78,29.78,6,29.5,6H28v1.5C28,7.78,27.78,8,27.5,8S27,7.78,27,7.5V6h-1.5 C25.22,6,25,5.78,25,5.5S25.22,5,25.5,5H27V3.5C27,3.22,27.22,3,27.5,3S28,3.22,28,3.5V5h1.5C29.78,5,30,5.22,30,5.5z"></path> <path fill="#31CFFF" d="M7,5.5C7,5.78,6.78,6,6.5,6H6v0.5C6,6.78,5.78,7,5.5,7S5,6.78,5,6.5V6H4.5C4.22,6,4,5.78,4,5.5S4.22,5,4.5,5 H5V4.5C5,4.22,5.22,4,5.5,4S6,4.22,6,4.5V5h0.5C6.78,5,7,5.22,7,5.5z"></path> <path fill="#FFD561" d="M22.96,10.73c-0.02-0.24-0.06-0.48-0.11-0.71c0-0.01,0-0.01,0-0.02c-0.42-2.13-1.76-3.94-3.58-5 c-0.14-0.09-0.289-0.16-0.439-0.23c-0.23-0.12-0.46-0.22-0.7-0.31c-0.33-0.12-0.67-0.23-1.02-0.3c-0.2-0.05-0.4-0.08-0.601-0.11 H16.5C12.83,4.54,10,7.68,10,11.48c0,1.37,0.36,2.65,1,3.75c0.65,1.13,1.91,3.01,3,4.6v-5.92C13.84,13.96,13.68,14,13.5,14 c-0.83,0-1.5-0.67-1.5-1.5s0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5V21h1v-8.5c0-0.83,0.67-1.5,1.5-1.5c0.68,0,1.25,0.45,1.43,1.07 C19.55,12.25,20,12.82,20,13.5c0,0.83-0.67,1.5-1.5,1.5c-0.18,0-0.34-0.03-0.5-0.09V21h0.19c0.76-1.09,1.75-2.54,2.59-3.82 c0.1-0.14,0.189-0.28,0.27-0.42c0.38-0.58,0.71-1.11,0.95-1.53c0.64-1.1,1-2.38,1-3.75C23,11.22,22.99,10.98,22.96,10.73z"></path> <g> <path fill="#2D2220" d="M22.03,6H20.6c0.891,0.81,1.57,1.84,1.971,3h1.069C23.31,7.89,22.76,6.87,22.03,6z"></path> <path fill="#BCBCBC" d="M18,22c0,0,0,0.41,0,1h-3c0-0.59,0-1,0-1H18z"></path> <rect x="15" y="24" fill="#BCBCBC" width="3" height="1"></rect> <path fill="#BCBCBC" d="M15,26h3v0.95c0,0.71-0.76,1.39-1.5,1.76c-0.74-0.37-1.5-1.05-1.5-1.76V26z"></path> </g> <path fill="#2D2220" d="M28,22.5c0,0.28-0.22,0.5-0.5,0.5H27v0.5c0,0.28-0.22,0.5-0.5,0.5S26,23.78,26,23.5V23h-0.5 c-0.28,0-0.5-0.22-0.5-0.5s0.22-0.5,0.5-0.5H26v-0.5c0-0.28,0.22-0.5,0.5-0.5s0.5,0.22,0.5,0.5V22h0.5C27.78,22,28,22.22,28,22.5z"></path> <path fill="#2D2220" d="M7,23.5C7,23.78,6.78,24,6.5,24H5v1.5C5,25.78,4.78,26,4.5,26S4,25.78,4,25.5V24H2.5C2.22,24,2,23.78,2,23.5 S2.22,23,2.5,23H4v-1.5C4,21.22,4.22,21,4.5,21S5,21.22,5,21.5V23h1.5C6.78,23,7,23.22,7,23.5z"></path> <path fill="#2D2220" d="M29,4.5C29,4.78,28.78,5,28.5,5H27v1.5C27,6.78,26.78,7,26.5,7S26,6.78,26,6.5V5h-1.5 C24.22,5,24,4.78,24,4.5S24.22,4,24.5,4H26V2.5C26,2.22,26.22,2,26.5,2S27,2.22,27,2.5V4h1.5C28.78,4,29,4.22,29,4.5z"></path> <path fill="#2D2220" d="M6,4.5C6,4.78,5.78,5,5.5,5H5v0.5C5,5.78,4.78,6,4.5,6S4,5.78,4,5.5V5H3.5C3.22,5,3,4.78,3,4.5S3.22,4,3.5,4 H4V3.5C4,3.22,4.22,3,4.5,3S5,3.22,5,3.5V4h0.5C5.78,4,6,4.22,6,4.5z"></path> <path fill="#2D2220" d="M22.87,15.68c0.72-1.25,1.13-2.7,1.13-4.24c0-0.49-0.04-0.97-0.12-1.44h-1.03C22.95,10.48,23,10.97,23,11.48 c0,1.37-0.36,2.65-1,3.75c-0.82,1.42-2.61,4.04-3.81,5.77H17v-7.09c0.16,0.05,0.32,0.09,0.5,0.09c0.83,0,1.5-0.67,1.5-1.5 S18.33,11,17.5,11S16,11.67,16,12.5V21h-1v-8.5c0-0.83-0.67-1.5-1.5-1.5S12,11.67,12,12.5s0.67,1.5,1.5,1.5 c0.18,0,0.34-0.04,0.5-0.09V21h-1.19c-1.2-1.73-2.99-4.35-3.81-5.77c-0.64-1.1-1-2.38-1-3.75c0-4.14,3.36-7.5,7.5-7.5 c1.37,0,2.65,0.37,3.75,1.02h1.79c-1.49-1.29-3.43-2.06-5.54-2.06c-4.69,0-8.5,3.81-8.5,8.5c0,1.54,0.41,2.99,1.13,4.24 c0.84,1.44,2.54,4.02,3.87,5.99V23h-0.5c-0.28,0-0.5,0.22-0.5,0.5s0.22,0.5,0.5,0.5H12v1h-0.5c-0.28,0-0.5,0.22-0.5,0.5 s0.22,0.5,0.5,0.5H12v0.95C12,28.5,14.29,30,15.5,30s3.5-1.5,3.5-3.05V26h0.5c0.28,0,0.5-0.22,0.5-0.5S19.78,25,19.5,25H19v-1h0.5 c0.28,0,0.5-0.22,0.5-0.5S19.78,23,19.5,23H19v-1.33C20.33,19.7,22.03,17.12,22.87,15.68z M17.5,11.99c0.27,0,0.49,0.23,0.49,0.5 c0,0.28-0.221,0.5-0.49,0.5s-0.49-0.22-0.49-0.5C17.01,12.22,17.23,11.99,17.5,11.99z M13.5,13c-0.27,0-0.49-0.23-0.49-0.5 c0-0.28,0.22-0.5,0.49-0.5s0.49,0.22,0.49,0.5C13.99,12.77,13.77,13,13.5,13z M18,26.95c0,0.71-0.76,1.39-1.5,1.76 c-0.36,0.18-0.72,0.29-1,0.29c-0.83,0-2.5-1-2.5-2.05V26h5V26.95z M18,25h-5v-1h5V25z M18,23h-5c0-0.59,0-1,0-1h5 C18,22,18,22.41,18,23z"></path> </g></svg>
                        <div className="text-center mt-2">
                            <span className="text-sm font-medium text-gray-700">Actionable Insights</span>
                        </div>
                    </div>
                    
                    {/* Subtle background doodles */}
                    <div className="absolute top-1/3 left-1/3 w-16 h-16 opacity-60">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <circle cx="50" cy="50" r="3" fill="#9ca3af"/>
                            <circle cx="80" cy="60" r="3" fill="#9ca3af"/>
                            <circle cx="110" cy="40" r="3" fill="#9ca3af"/>
                            <circle cx="140" cy="70" r="3" fill="#9ca3af"/>
                            <line x1="50" y1="50" x2="80" y2="60" stroke="#9ca3af" strokeWidth="1"/>
                            <line x1="80" y1="60" x2="110" y2="40" stroke="#9ca3af" strokeWidth="1"/>
                            <line x1="110" y1="40" x2="140" y2="70" stroke="#9ca3af" strokeWidth="1"/>
                        </svg>
                    </div>
                    
                    <div className="absolute bottom-1/3 right-1/3 w-12 h-12 opacity-5">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <rect x="40" y="40" width="20" height="20" fill="#9ca3af" opacity="0.5"/>
                            <rect x="70" y="70" width="20" height="20" fill="#9ca3af" opacity="0.5"/>
                            <rect x="100" y="50" width="20" height="20" fill="#9ca3af" opacity="0.5"/>
                        </svg>
                    </div>
                    
                    <div className="absolute top-1/2 right-1/4 w-8 h-8 opacity-5">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <path d="M50 50 L60 40 L70 50 L60 60 Z" fill="#9ca3af"/>
                            <path d="M80 80 L90 70 L100 80 L90 90 Z" fill="#9ca3af"/>
                        </svg>
                    </div>
                    
                    <div className="absolute bottom-1/2 left-1/4 w-10 h-10 opacity-5">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <circle cx="50" cy="50" r="4" fill="#9ca3af"/>
                            <circle cx="80" cy="80" r="4" fill="#9ca3af"/>
                            <circle cx="110" cy="60" r="4" fill="#9ca3af"/>
                            <line x1="50" y1="50" x2="80" y2="80" stroke="#9ca3af" strokeWidth="1"/>
                            <line x1="80" y1="80" x2="110" y2="60" stroke="#9ca3af" strokeWidth="1"/>
                        </svg>
                    </div>
                    
                    {/* Checkmark */}
                    <div className="absolute top-1/4 right-1/3 w-6 h-6 opacity-5">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <path d="M30 100 L50 120 L80 80" stroke="#9ca3af" strokeWidth="3" fill="none"/>
                        </svg>
                    </div>
                    
                    {/* Arrow */}
                    <div className="absolute bottom-1/4 left-1/2 w-6 h-6 opacity-5">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <path d="M50 120 L50 80 L30 100 L50 120 L70 100 Z" fill="#9ca3af"/>
                        </svg>
                    </div>
                    
                    {/* Star */}
                    <div className="absolute bottom-8 right-8 w-4 h-4 opacity-5">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <path d="M100 20 L110 80 L170 80 L120 120 L140 180 L100 140 L60 180 L80 120 L30 80 L90 80 Z" fill="#9ca3af"/>
                        </svg>
                    </div>
                </div>
                
                <div className="w-full px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="text-center">
                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <div className="h-24 w-24 rounded-2xl bg-gray-50 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-3xl font-bold shadow-2xl">
                                IF
                            </div>
                        </div>
                        
                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                            InsightForm
                        </h1>
                        
                        {/* Description */}
                        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Transform your data collection with intelligent forms powered by AI. 
                            Create, analyze, and optimize surveys that deliver actionable insights.
                        </p>
                        
                        {/* Get Started Button */}
                        <Link
                            to={getStartedLink}
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                        >
                            Get Started
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Companies Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-16">
                        Trusted by Leading Companies
                    </h2>
                    
                    {/* Major Company Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
                        {/* Company 1 - TechCorp */}
                        <div className="bg-white rounded-2xl p-5 sm:p-6 lg:p-8 shadow-lg transition-shadow duration-300 border border-gray-100">
                            <div className="flex items-center mb-6">
                                <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                    TC
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-bold text-gray-900">TechCorp</h3>
                                    <p className="text-gray-600">Technology Solutions</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">
                                "InsightForm revolutionized our customer feedback process. The AI-powered analysis 
                                helped us increase response rates by 40% and gain deeper insights into user behavior."
                            </p>
                            <div className="flex text-yellow-400 mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>

                        {/* Company 2 - DataFlow */}
                        <div className="bg-white rounded-2xl p-5 sm:p-6 lg:p-8 shadow-lg transition-shadow duration-300 border border-gray-100">
                            <div className="flex items-center mb-6">
                                <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                    DF
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-bold text-gray-900">DataFlow</h3>
                                    <p className="text-gray-600">Analytics Platform</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">
                                "The advanced survey features and real-time analytics have transformed how we 
                                collect and process data. Our team productivity increased by 60%."
                            </p>
                            <div className="flex text-yellow-400 mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>

                        {/* Company 3 - InnovateLab */}
                        <div className="bg-white rounded-2xl p-5 sm:p-6 lg:p-8 shadow-lg transition-shadow duration-300 border border-gray-100">
                            <div className="flex items-center mb-6">
                                <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                    IL
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-bold text-gray-900">InnovateLab</h3>
                                    <p className="text-gray-600">Research & Development</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">
                                "InsightForm's intelligent form builder and automated analysis features 
                                have streamlined our research processes and improved data quality significantly."
                            </p>
                            <div className="flex text-yellow-400 mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Company Strip */}
                    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-none sm:rounded-xl shadow-none sm:shadow-lg border-t sm:border border-gray-100 w-full">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
                            And many more trusted partners
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 place-items-center">
                            {['CloudTech', 'DataSync', 'FormPro', 'SurveyMax', 'AnalyticsHub', 'ResearchCorp', 'DataVault', 'InsightLab'].map((company, index) => (
                                <div key={index} className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2">
                                    <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                                        {company.charAt(0)}
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">{company}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
                        What InsightForm Helps You Do
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: 'Advanced Survey Creation', desc: 'Build sophisticated surveys with conditional logic, multiple question types, and custom styling to capture the data you need.', icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            ) },
                            { title: 'AI-Powered Forms', desc: 'Leverage AI to optimize form design, predict user behavior, and automatically improve question flow for better responses.', icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            ) },
                            { title: 'Smart Analytics', desc: 'Get instant insights with real-time analytics, automated reports, and data visualization tools for informed decisions.', icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            ) },
                            { title: 'Real-time Collaboration', desc: 'Work together with team members, share forms, and collaborate on data analysis in real time.', icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 009.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            ) },
                            { title: 'Enterprise Security', desc: 'Bank-level encryption, GDPR compliance, and advanced security to protect your data.', icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            ) },
                            { title: 'Custom Integrations', desc: 'Connect with your favorite tools via our API and pre-built integrations.', icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            ) },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-xl p-5 shadow-lg transition-shadow duration-200 border border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {item.icon}
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                                        <p className="text-sm text-gray-600">{item.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))} 
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-blue-600 border-t border-blue-500 w-full mt-8">
                <div className="w-full py-10 px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-12 w-12 rounded-xl bg-white text-blue-900 flex items-center justify-center text-xl font-bold">
                                    IF
                                </div>
                                <span className="text-2xl font-bold">InsightForm</span>
                            </div>
                            <p className="text-gray-100 mb-6 max-w-md">
                                Transform your data collection with intelligent forms powered by AI. 
                                Create, analyze, and optimize surveys that deliver actionable insights.
                            </p>
                            
                            {/* Social Media */}
                            <div>
                                <h3 className="text-gray-100 text-lg font-semibold mb-4">Follow Us</h3>
                                <div className="flex gap-4">
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                                       className="h-10 w-10 bg-white hover:bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center transition-colors shadow-sm">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                        </svg>
                                    </a>
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                                       className="h-10 w-10 bg-white hover:bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center transition-colors shadow-sm">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                        </svg>
                                    </a>
                                    <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                                       className="h-10 w-10 bg-white hover:bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center transition-colors shadow-sm">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                        </svg>
                                    </a>
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                                       className="h-10 w-10 bg-white hover:bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center transition-colors shadow-sm">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg text-gray-100 font-semibold mb-4">Contact Us</h3>
                            <div className="space-y-3 text-gray-600">
                                <div className="text-gray-100 flex items-center gap-3">
                                    <svg className="h-5 w-5 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span>+91 1234567890</span>
                                </div>
                                <div className="text-gray-100 flex items-center gap-3">
                                    <svg className="h-5 w-5 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>test.app.services.26@gmail.com</span>
                                </div>
                                <div className="text-gray-100 flex items-center gap-3">
                                    <svg className="h-5 w-5 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Brahmagiri Hostel, Mangalore, NITK</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-gray-100 text-lg font-semibold mb-4">Quick Links</h3>
                            <div className="space-y-3">
                                <Link to="/about" className="block text-gray-100 hover:text-gray-900 transition-colors">About Us</Link>
                                <Link to="/contact" className="block text-gray-100 hover:text-gray-900 transition-colors">Contact</Link>
                                <Link to="/login" className="block text-gray-100 hover:text-gray-900 transition-colors">Login</Link>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-100">
                        <p>&copy; 2025 InsightForm. All rights reserved. | Privacy Policy | Terms of Service</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
