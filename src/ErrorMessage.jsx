function ErrorMessage({message,color='red',textColor='red'}){
    const bgColors = {
    red: 'bg-red-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
  };

  const textColors = {
    red: 'text-red-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
  };

  const style = `
    fade-in-out ring-1 text-2xl
    ${textColors[textColor] || 'text-red-500'}
    ${bgColors[color] || 'bg-red-100'}
    fixed p-5 top-[15%] z-[99999] rounded-lg
  `;

    return(
        <div 
            className={style}>  
            {message}
        </div>
    )
}

export default ErrorMessage;