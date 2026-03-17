import React from 'react'

const BackgroundGlows = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="absolute -top-48 left-1/2 -translate-x-1/2 w-[700px] h-[600px]"
        style={{
          background:
            'radial-gradient(ellipse at center,rgba(245,158,11,0.10) 0%,transparent 70%)'
        }}
      />
      <div
        className="absolute top-[45%] -right-40 w-[450px] h-[450px]"
        style={{
          background:
            'radial-gradient(ellipse at center,rgba(217,119,6,0.07) 0%,transparent 70%)'
        }}
      />
      <div
        className="absolute top-[70%] -left-32 w-[380px] h-[380px]"
        style={{
          background:
            'radial-gradient(ellipse at center,rgba(245,158,11,0.06) 0%,transparent 70%)'
        }}
      />
    </div>
  )
}

export default BackgroundGlows
