<template>
  <div class="flex bg-gray-100 min-h-screen mx-auto">
    <div class="flex-grow text-gray-800 pa-6">
      <div class="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-center">
        <div class="mr-6 text-center d-flex justify-center">
          <h1 class="text-4xl font-bold mb-2 uppercase mt-6">Dashboard</h1>
        </div>
      </div>

      <!--ส่วนนี้จะเป็นหัวข้อผู้ป่วยทั่วป่วยเดือนนี้-->
      <div class="flex justify-center ">
        <section class="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-5 mb-5 d-flex justify-center ">
          <div class="flex items-center p-8 bg-white shadow rounded-lg justify-center"
            style="max-width: 300px; margin: auto;">
            <div
              class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <span class="block text-2xl font-medium">ผู้ป่วยทั่วไปของเดือนนี้</span>
              <!-- <span class="block text-gray-500">ผู้ป่วยทั่วไปของเดือนนี้</span> -->
            </div>
          </div>
        </section>
      </div>

      <section class="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div class="flex items-center p-8 bg-white shadow rounded-lg">
          <div
            class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <span class="block text-2xl font-bold">รวม {{ AllserviceCount }} <span>คน</span></span>
            <span class="block text-gray-500">ผู้ป่วยทั่วไป</span>
          </div>
        </div>
        <div class="flex items-center p-8 bg-white shadow rounded-lg">
          <div
            class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-yellow-600 bg-yellow-100 rounded-full mr-6">
            <svg width="98px" height="98px" viewBox="-8.16 -8.16 40.32 40.32" fill="none"
              xmlns="http://www.w3.org/2000/svg" transform="rotate(0)">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC"
                stroke-width="0.192"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M3 5V19M3 16H21M21 19V13.2C21 12.0799 21 11.5198 20.782 11.092C20.5903 10.7157 20.2843 10.4097 19.908 10.218C19.4802 10 18.9201 10 17.8 10H11V15.7273M7 12H7.01M8 12C8 12.5523 7.55228 13 7 13C6.44772 13 6 12.5523 6 12C6 11.4477 6.44772 11 7 11C7.55228 11 8 11.4477 8 12Z"
                  stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </g>
            </svg>
          </div>
          <div>
            <span class="block text-2xl font-bold">จำนวน {{ serviceBedCount }} <span>คน</span></span>
            <span class="block text-gray-500">ผู้ป่วยติดเตียง</span>
          </div>
        </div>
        <div class="flex items-center p-8 bg-white shadow rounded-lg">
          <div
            class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
            <svg width="98px" height="98px" viewBox="-348.16 -348.16 1720.32 1720.32" xmlns="http://www.w3.org/2000/svg"
              fill="#000000" stroke="#000000" stroke-width="0.01024">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path fill="#000000"
                  d="M864 409.6a192 192 0 0 1-37.888 349.44A256.064 256.064 0 0 1 576 960h-96a32 32 0 1 1 0-64h96a192.064 192.064 0 0 0 181.12-128H736a32 32 0 0 1-32-32V416a32 32 0 0 1 32-32h32c10.368 0 20.544.832 30.528 2.432a288 288 0 0 0-573.056 0A193.235 193.235 0 0 1 256 384h32a32 32 0 0 1 32 32v320a32 32 0 0 1-32 32h-32a192 192 0 0 1-96-358.4 352 352 0 0 1 704 0zM256 448a128 128 0 1 0 0 256V448zm640 128a128 128 0 0 0-128-128v256a128 128 0 0 0 128-128z">
                </path>
              </g>
            </svg>
          </div>
          <div>
            <span class="inline-block text-2xl font-bold">จำนวน {{ serviceCount }} <span>คน</span></span>
            <!-- <span class="inline-block text-xl text-gray-500 font-semibold">(14%)</span> -->
            <span class="block text-gray-500">งานบริการ </span>
          </div>
        </div>
        <div class="flex items-center p-8 bg-white shadow rounded-lg">
          <div
            class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
            <svg fill="#000000" width="98px" height="98px" viewBox="-10.88 -10.88 53.76 53.76"
              style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;" version="1.1"
              xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:serif="http://www.serif.com/"
              xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M4.234,6.266c-1.409,1.45 -2.202,3.415 -2.202,5.464c-0,2.05 0.793,4.015 2.202,5.464l9.625,9.899c0.568,0.584 1.339,0.91 2.143,0.91c0.803,0 1.575,-0.326 2.143,-0.91c1.743,-1.793 9.617,-9.907 9.617,-9.907c1.409,-1.449 2.202,-3.414 2.202,-5.464c0,-2.05 -0.793,-4.014 -2.202,-5.464c-0,0 -0,0 -0,0c-1.419,-1.459 -3.345,-2.277 -5.352,-2.277c-2.007,-0 -3.932,0.818 -5.351,2.277c-0,0 -1.065,1.095 -1.065,1.095c0,0 -1.057,-1.087 -1.057,-1.087c-1.419,-1.459 -3.344,-2.277 -5.351,-2.277c-2.007,0 -3.933,0.818 -5.352,2.277m1.434,1.395c1.039,-1.069 2.448,-1.672 3.918,-1.672c1.47,0 2.878,0.603 3.917,1.672c0,-0 1.774,1.824 1.774,1.824c0.188,0.193 0.447,0.303 0.717,0.303c0.27,-0 0.529,-0.11 0.717,-0.303l1.782,-1.833c1.039,-1.068 2.447,-1.671 3.917,-1.671c1.47,-0 2.878,0.603 3.918,1.671c0.003,0.004 0.006,0.007 0.01,0.011c1.039,1.069 1.626,2.533 1.626,4.059c0,1.526 -0.587,2.991 -1.636,4.07c-0,-0 -7.874,8.114 -9.617,9.907c-0.188,0.193 -0.443,0.304 -0.709,0.304c-0.266,0 -0.521,-0.111 -0.709,-0.304l-9.625,-9.899c-1.049,-1.079 -1.636,-2.544 -1.636,-4.07c-0,-1.526 0.587,-2.99 1.636,-4.069">
                </path>
                <path
                  d="M14.998,15.003l-1.997,-0c-0.552,-0 -1,0.448 -1,1c0,0.552 0.448,1 1,1l1.997,-0l-0,1.997c-0,0.552 0.448,1 1,1c0.552,-0 1,-0.448 1,-1l-0,-1.997l1.997,-0c0.552,-0 1,-0.448 1,-1c-0,-0.552 -0.448,-1 -1,-1l-1.997,-0l-0,-1.997c-0,-0.552 -0.448,-1 -1,-1c-0.552,0 -1,0.448 -1,1l-0,1.997Z">
                </path>
              </g>
            </svg>
          </div>
          <div>
            <span class="block text-2xl font-bold">จำนวน {{ serviceCountOther }} <span>คน</span></span>
            <span class="block text-gray-500">อื่นๆ</span>
          </div>
        </div>
      </section>

      <!--ส่วนนี้จะเป็นหัวข้อผู้ป่วยฉุกเฉินเดือนนี้-->
      <div class="flex justify-center ">
        <section class="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-5 mb-5 d-flex justify-center ">
          <div class="flex items-center p-8 bg-white shadow rounded-lg justify-center"
            style="max-width: 300px; margin: auto;">
            <div
              class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-400 rounded-full mr-6">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
                width="40" height="98" viewBox="0 0 256 256" xml:space="preserve">
                <defs>
                </defs>
                <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;"
                  transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                  <path
                    d="M 66.816 75.708 c -1.104 0 -2 -0.896 -2 -2 V 48.883 c 0 -10.927 -8.89 -19.816 -19.816 -19.816 s -19.816 8.889 -19.816 19.816 v 24.825 c 0 1.104 -0.896 2 -2 2 s -2 -0.896 -2 -2 V 48.883 c 0 -13.132 10.684 -23.816 23.816 -23.816 c 13.133 0 23.816 10.684 23.816 23.816 v 24.825 C 68.816 74.813 67.921 75.708 66.816 75.708 z"
                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                    transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                  <path
                    d="M 74.768 89.663 H 15.232 c -2.94 0 -5.333 -2.392 -5.333 -5.332 v -7.29 c 0 -2.94 2.392 -5.333 5.333 -5.333 h 59.536 c 2.94 0 5.333 2.393 5.333 5.333 v 7.29 C 80.101 87.271 77.708 89.663 74.768 89.663 z M 15.232 75.708 c -0.735 0 -1.333 0.598 -1.333 1.333 v 7.29 c 0 0.734 0.598 1.332 1.333 1.332 h 59.536 c 0.735 0 1.333 -0.598 1.333 -1.332 v -7.29 c 0 -0.735 -0.598 -1.333 -1.333 -1.333 H 15.232 z"
                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                    transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                  <path
                    d="M 58.069 52.77 c -1.104 0 -2 -0.896 -2 -2 c 0 -6.104 -4.966 -11.07 -11.069 -11.07 c -1.104 0 -2 -0.896 -2 -2 s 0.896 -2 2 -2 c 8.31 0 15.069 6.761 15.069 15.07 C 60.069 51.874 59.174 52.77 58.069 52.77 z"
                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                    transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                  <path
                    d="M 14.389 47.336 H 2 c -1.104 0 -2 -0.895 -2 -2 c 0 -1.104 0.896 -2 2 -2 h 12.389 c 1.104 0 2 0.896 2 2 C 16.389 46.441 15.494 47.336 14.389 47.336 z"
                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                    transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                  <path
                    d="M 88 47.336 H 75.61 c -1.104 0 -2 -0.895 -2 -2 c 0 -1.104 0.896 -2 2 -2 H 88 c 1.104 0 2 0.896 2 2 C 90 46.441 89.104 47.336 88 47.336 z"
                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                    transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                  <path
                    d="M 45 16.726 c -1.104 0 -2 -0.896 -2 -2 V 2.336 c 0 -1.104 0.896 -2 2 -2 s 2 0.896 2 2 v 12.39 C 47 15.831 46.104 16.726 45 16.726 z"
                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                    transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                  <path
                    d="M 23.355 25.691 c -0.512 0 -1.024 -0.195 -1.414 -0.586 l -8.761 -8.761 c -0.781 -0.781 -0.781 -2.047 0 -2.828 c 0.78 -0.781 2.048 -0.781 2.828 0 l 8.761 8.761 c 0.781 0.781 0.781 2.047 0 2.828 C 24.379 25.496 23.867 25.691 23.355 25.691 z"
                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                    transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                  <path
                    d="M 66.645 25.691 c -0.512 0 -1.023 -0.195 -1.414 -0.586 c -0.781 -0.781 -0.781 -2.047 0 -2.828 l 8.761 -8.761 c 0.781 -0.781 2.047 -0.781 2.828 0 c 0.781 0.781 0.781 2.047 0 2.828 l -8.761 8.761 C 67.668 25.496 67.156 25.691 66.645 25.691 z"
                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                    transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                </g>
              </svg>
            </div>
            <div>
              <span class="block text-2xl font-medium  ">ผู้ป่วยฉุกเฉินของเดือนปัจจุบัน</span>
            </div>
          </div>
        </section>
      </div>

      <section class="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div class="flex items-center p-8 bg-white shadow rounded-lg">
          <div
            class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-orange-100 rounded-full mr-6">
            <svg fill="#000000" width="98px" height="98px" viewBox="-174.08 -174.08 860.16 860.16"
              xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path 
                  d="M128 244v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12zm140 12h40c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12zm-76 84v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm76 12h40c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12zm180 124v36H0v-36c0-6.627 5.373-12 12-12h19.5V85.035C31.5 73.418 42.245 64 55.5 64H144V24c0-13.255 10.745-24 24-24h112c13.255 0 24 10.745 24 24v40h88.5c13.255 0 24 9.418 24 21.035V464H436c6.627 0 12 5.373 12 12zM79.5 463H192v-67c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v67h112.5V112H304v24c0 13.255-10.745 24-24 24H168c-13.255 0-24-10.745-24-24v-24H79.5v351zM266 64h-26V38a6 6 0 0 0-6-6h-20a6 6 0 0 0-6 6v26h-26a6 6 0 0 0-6 6v20a6 6 0 0 0 6 6h26v26a6 6 0 0 0 6 6h20a6 6 0 0 0 6-6V96h26a6 6 0 0 0 6-6V70a6 6 0 0 0-6-6z">
                </path>
              </g>
            </svg>
          </div>
          <div>
            <span class="block text-2xl font-bold">รวม {{ emergencyCount }} <span>คน</span></span>
            <span class="block text-gray-500">ผู้ป่วยฉุกเฉิน</span>
          </div>
        </div>

        <div class="flex items-center p-8 bg-white shadow rounded-lg">
          <div
            class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-300 rounded-full mr-6">
            <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink" width="89px" height="89px"
              viewBox="-33.59 -33.59 165.97 165.97" xml:space="preserve" stroke="#000000"
              stroke-width="0.0009878600000000001">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <g>
                    <path
                      d="M96.673,12.766c1.164,0,2.113-0.947,2.113-2.111h-0.722c0,0.768-0.623,1.393-1.393,1.393h-7.431V9.186h-2.156v2.861H81.69 c-0.166-0.466-0.451-0.748-0.807-0.748c-0.354,0-0.643,0.282-0.807,0.748h-0.479c-0.767,0-1.392-0.625-1.392-1.393h-0.72 c0,1.164,0.947,2.111,2.11,2.111h0.338c-0.006,0.093-0.015,0.187-0.015,0.285c0,0.134,0.009,0.262,0.021,0.384h-1.274 c-0.893,0-1.614,0.726-1.614,1.617v7.776c0,0.893,0.723,1.616,1.614,1.616h0.479v2.206h0.171 c-0.279,6.772-3.076,9.689-10.258,10.716c-1.083,0.161-2.466,0.137-3.931,0.115c-2.767-0.044-5.906-0.094-7.877,1.139 c-1.679,1.048-2.186,2.602-2.673,4.104c-0.402,1.232-0.781,2.397-1.789,3.306c-0.545,0.507-1.159,0.847-1.824,1.085 c-12.313-1.354-12.32-1.354-12.32-1.354v0.877c-8.062,1.543-12.11-2.202-12.323-2.408c-1.068-1.064-2.798-1.075-3.874-0.017 c-1.088,1.065-1.103,2.811-0.038,3.896c0.211,0.216,4.449,4.422,12.491,4.422c1.166,0,2.418-0.095,3.744-0.297v1.245 c-1.273,0.19-2.532,0.296-3.758,0.296c-8.139,0-12.466-4.156-12.933-4.631c-0.421-0.43-0.713-0.946-0.892-1.503 c-0.019-0.052-0.031-0.105-0.047-0.16c-0.044-0.157-0.08-0.315-0.102-0.479c-0.006-0.041-0.022-0.079-0.026-0.121 c-0.009-0.07,0-0.141-0.003-0.21c-0.004-0.078-0.022-0.152-0.021-0.231c0-0.046,0.013-0.091,0.016-0.137 c0.006-0.125,0.021-0.246,0.039-0.368c0.019-0.131,0.038-0.259,0.07-0.386c0.019-0.07,0.043-0.14,0.065-0.21 c0.186-0.591,0.497-1.137,0.951-1.582c0.717-0.702,1.663-1.09,2.668-1.09c1.015,0,1.971,0.396,2.689,1.113 c0.088,0.084,2.523,2.379,7.505,2.379c0.122,0,0.248-0.008,0.372-0.012c-4.335-1.47-8.893-3.931-8.893-3.931 c-2.07-1.336-4.631-0.414-6.135,1.009c0,0-0.502,0.429-0.855,1.003c-0.336,0.549-0.601,1.235-0.601,1.235l-0.008,0.016 c-0.5,1.445-0.512,3.287,0.34,4.695c0,0,0.576,0.85,1.275,1.319c0,0,9.863,6.797,16.078,7.004 c0.755,0.025,1.485,0.035,2.203,0.037v1.236h-5.333L13.641,49.301c0.275-0.104,0.519-0.295,0.664-0.575 c0.312-0.603,0.078-1.344-0.522-1.656l-6.768-3.516c-0.603-0.313-1.343-0.078-1.656,0.524c-0.126,0.244-0.144,0.508-0.103,0.76 l-0.874-0.466c-1.493-0.749-3.311-0.146-4.06,1.347c-0.749,1.493-0.146,3.31,1.347,4.059l26.999,14.432H8.979 c-1.002,0-1.815,0.813-1.815,1.814v1.008c0,1.002,0.813,1.814,1.815,1.814h6.38c-0.015,0.133-0.024,0.268-0.024,0.402v15.5 c-0.625,0.5-1.033,1.261-1.033,2.123c0,1.506,1.222,2.729,2.729,2.729c1.508,0,2.729-1.223,2.729-2.729 c0-0.752-0.305-1.432-0.795-1.924v-3.402h54.833v3.18c-0.641,0.499-1.062,1.271-1.062,2.146c0,1.506,1.221,2.729,2.729,2.729 c1.507,0,2.729-1.223,2.729-2.729c0-0.734-0.294-1.398-0.766-1.89V69.249c0-1.928-1.511-3.504-3.411-3.617 c1.162-0.422,1.999-1.525,1.999-2.833c0-1.616-1.271-2.925-2.865-3.009c0.691-3.799-0.308-10.27-14.334-11.812 c-2.294-0.252-4.312-0.475-6.113-0.673c0.253-0.17,0.499-0.357,0.731-0.576c1.191-1.072,1.628-2.413,2.05-3.711 c0.458-1.403,0.891-2.729,2.273-3.595c1.734-1.084,4.727-1.033,7.36-0.994c1.505,0.023,2.925,0.047,4.081-0.124 c7.665-1.096,10.74-4.373,11.03-11.655h0.148v-2.206h1.046v0.974h1.227v-0.974h0.448c0.894,0,1.616-0.724,1.616-1.616v-7.776 c0-0.892-0.724-1.617-1.616-1.617h-1.271c0.014-0.122,0.021-0.25,0.021-0.384c0-0.099-0.009-0.192-0.017-0.285h5.254l-0.01,69.314 h-1.291c-2.291,0-4.249,1.43-5.049,3.438c-0.855,0.261-1.483,1.048-1.483,1.99c0,1.153,0.936,2.09,2.088,2.09 c1.155,0,2.091-0.937,2.091-2.09c0-0.556-0.22-1.056-0.569-1.429c0.531-1.084,1.636-1.838,2.924-1.838h4.865 c1.287,0,2.393,0.754,2.924,1.838c-0.352,0.373-0.569,0.873-0.569,1.429c0,1.153,0.935,2.09,2.089,2.09s2.089-0.937,2.089-2.09 c0-0.942-0.627-1.729-1.483-1.99c-0.799-2.01-2.758-3.438-5.048-3.438H89.24l0.004-69.314H96.673z M73.797,69.249v9.877H18.964 v-9.877H73.797z M80.665,12.766h0.441c0.008,0.091,0.021,0.178,0.021,0.285c0,0.142-0.011,0.27-0.027,0.384h-0.43 c-0.016-0.114-0.027-0.242-0.027-0.384C80.643,12.944,80.657,12.857,80.665,12.766z M82.561,19.242c0,0.938-0.761,1.7-1.699,1.7 c-0.938,0-1.698-0.762-1.698-1.7s1.698-3.598,1.698-3.598S82.561,18.304,82.561,19.242z">
                    </path>
                    <circle cx="14.335" cy="40.03" r="6.014"></circle>
                  </g>
                </g>
              </g>
            </svg>
          </div>
          <div>
            <span class="block text-2xl font-bold">สีแดง {{ redCount }} <span>คน</span></span>
            <span class="block text-gray-500">ผู้ป่วยฉุกเฉินวิกฤติ</span>
          </div>
        </div>

        <div class="flex items-center p-8 bg-white shadow rounded-lg">
          <div
            class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-yellow-600 bg-yellow-100 rounded-full mr-6">
            <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink" width="87px" height="87px"
              viewBox="-31.89 -31.89 160.40 160.40" xml:space="preserve">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <g>
                    <path
                      d="M31.642,22.691c5.311,1.138,10.541-2.246,11.68-7.559c0.254-1.183,0.271-2.359,0.105-3.49L48.828,0l-7.489,1.934 l-9.606-1.933l-1.482,3.866l0.002,0.001c-3.033,1.139-5.44,3.743-6.17,7.143C22.946,16.324,26.33,21.553,31.642,22.691z">
                    </path>
                    <circle cx="68.822" cy="25.679" r="9.281"></circle>
                    <path
                      d="M93.753,91.378l-0.355-1.323l-7.661,3.541c0.624,2.184,2.882,3.475,5.079,2.883 C93.037,95.881,94.351,93.598,93.753,91.378z">
                    </path>
                    <polygon points="92.696,87.441 84.388,88.602 85.307,92.012 92.97,88.467 "></polygon>
                    <path
                      d="M91.451,82.814l-7.293,3.104c0.012-0.021,0.021-0.043,0.031-0.064c0.016-0.209,0.023-0.42,0.043-0.627 c0.034-0.406,0.098-0.801,0.186-1.188l6.607-2.812l-4.27-16.293c-0.147-0.559-0.414-1.058-0.75-1.494 c0.045,0,0.09,0.002,0.137,0.002c1.988,0,3.604-1.612,3.604-3.603c0-1.989-1.613-3.603-3.604-3.603 c-5.432,0-8.93-2.24-10.742-13.689c-0.042-0.26-0.111-0.508-0.205-0.744c-0.447-3.334-3.511-5.569-6.376-6.271 c0,0-0.976-0.293-2.015-0.27c-0.996,0.023-2.105,0.253-2.105,0.253l-0.027,0.006c-3.121,0.765-6.447,3.309-6.447,7.126 l0.001,18.57l-2.724-19.313c-0.215-1.614-1.705-2.747-3.312-2.532c-1.615,0.214-2.749,1.697-2.531,3.312l0.153,1.121 c-11.314-1.577-11.554-3.209-12.983-13.285c-0.021-0.156-0.07-0.301-0.11-0.45c-0.295-3.052-2.695-5.567-5.206-6.784 c0,0-0.949-0.52-2.031-0.727c-1.036-0.198-2.235-0.205-2.235-0.205l-0.029-0.002c-3.406,0.099-7.416,1.998-8.264,5.954 L2.724,69.779h9.701c-0.245,1.85-0.467,3.205-0.637,3.757c-0.428,1.382-3.744,6.526-7.097,11.011 c-1.649,2.208-1.698,5.086,0.509,6.737c2.36,1.464,4.757,0.553,5.737-0.759c1.718-2.295,7.418-10.096,8.639-14.037 c0.383-1.236,0.784-3.752,1.161-6.711h6.997c0.73,1.914,1.238,3.365,1.367,3.992c0.288,1.418-0.146,7.523-0.929,13.066 c-0.388,2.73,0.972,5.891,4.242,5.643c0.238-0.018-0.527,0.051-0.295,0.051c2.446,0,4.584-1.801,4.938-4.293 c0.402-2.84,1.65-12.42,0.824-16.461c-0.103-0.514-0.298-1.196-0.556-1.996h4.013c0,0-8.04-17.162-7.844-23.169l0.283-1.327 c2.74,3.199,7.266,5.035,15.334,6.137c0.176,0.023,0.352,0.035,0.521,0.035c0.422,0,0.83-0.079,1.214-0.209l2.415,17.361 c-1.596,2.664-2.516,5.777-2.516,9.102c0,9.799,7.971,17.77,17.77,17.77c6.475,0,12.15-3.48,15.257-8.67l0.001,0.006 c0.023-0.068,0.055-0.135,0.079-0.203l0.108,0.402l8.306-1.16L91.451,82.814z M73.197,57.889c1.854,1.644,3.939,3.07,6.297,4.239 L73.197,62.1V57.889z M68.517,89.417c-6.455,0-11.709-5.252-11.709-11.709c0-1.468,0.283-2.868,0.779-4.163 c0.209,0.031,0.42,0.053,0.637,0.053h21.242c0.484,1.281,0.762,2.664,0.762,4.11C80.228,84.165,74.974,89.417,68.517,89.417z">
                    </path>
                  </g>
                </g>
              </g>
            </svg>
          </div>
          <div>
            <span class="inline-block text-2xl font-bold">สีเหลือง {{ yellowCount }} <span>คน</span></span>
            <!-- <span class="inline-block text-xl text-gray-500 font-semibold">(14%)</span> -->
            <span class="block text-gray-500">ผู้ป่วยฉุกเฉินเร่งด่วน</span>
          </div>
        </div>

        <div class="flex items-center p-8 bg-white shadow rounded-lg">
          <div
            class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
            <svg fill="#000000" width="94px" height="94px" viewBox="-8.16 -8.16 40.32 40.32"
              xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.00024000000000000003">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M14,2H10A3,3,0,0,0,7,5V6H5A3,3,0,0,0,2,9V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V9a3,3,0,0,0-3-3H17V5A3,3,0,0,0,14,2ZM9,5a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V6H9ZM20,9V19a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V9A1,1,0,0,1,5,8H19A1,1,0,0,1,20,9Zm-7,4h2v2H13v2H11V15H9V13h2V11h2Z">
                </path>
              </g>
            </svg>
          </div>
          <div>
            <span class="block text-2xl font-bold">สีเขียว {{ greenCount }} <span>คน</span></span>
            <span class="block text-gray-500">ผู้ป่วยไม่ฉุกเฉิน</span>
          </div>
        </div>

        <div class="flex items-center p-8 bg-white shadow rounded-lg">
          <div class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600  rounded-full mr-6">
            <svg fill="#000000" width="95px" height="95px" viewBox="-34 -34 168.00 168.00"
              enable-background="new 0 0 100 100" id="Layer_1" version="1.1" xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <path
                    d="M32.9,69c0.9,5.3,5.3,11.1,9.4,13.9c2.5,1.7,5.3,2.5,8,2.5c0.9,0,1.7-0.1,2.5-0.3c9.7-2.1,11.7-14,10.7-21.5 c-0.5-3.8-1.6-7.6-3.2-11.3h0c7.3,0,13.2-5.9,13.2-13.2V17.1c0-1.4-1.1-2.5-2.5-2.5h-8.7v4h7.2v20.6c0,5.1-4.1,9.2-9.2,9.2h-6.3 c-5.1,0-9.2-4.1-9.2-9.2V18.6h7.3v-4h-8.8c-1.4,0-2.5,1.1-2.5,2.5v22.1c0,7.3,5.9,13.2,13.2,13.2H56c1.8,3.8,3.1,7.9,3.6,11.8 c0.8,5.8-0.6,15.6-7.6,17.1c-2.4,0.5-5.1-0.1-7.5-1.7c-3.2-2.2-6.7-6.8-7.6-10.7c3.5-1,6.2-4.2,6.2-8.1c0-4.6-3.8-8.4-8.4-8.4 s-8.4,3.8-8.4,8.4C26.4,64.8,29.2,68.2,32.9,69z M34.8,56.4c2.4,0,4.4,2,4.4,4.4s-2,4.4-4.4,4.4s-4.4-2-4.4-4.4 S32.4,56.4,34.8,56.4z">
                  </path>
                </g>
              </g>
            </svg>
          </div>
          <div>
            <span class="block text-2xl font-bold">สีขาว {{ whiteCount }} <span>คน</span></span>
            <span class="block text-gray-500">ผู้ป่วยทั่วไป</span>
          </div>
        </div>
      </section>

      <!-- Charts Row -->

      <v-row class="mt-12">

        <v-col cols="12" md="6" class="d-flex justify-center">
          <v-sheet :elevation="7" class="mx-auto rounded-xl" height="550" width="550px">
            <BarChartPatient :tableData="desserts" />
          </v-sheet>
        </v-col>


        <v-col cols="12" md="6" class="d-flex justify-center w-full">
          <v-sheet :elevation="7" class="mx-auto rounded-xl" height="550" width="550px">
            <PieChartPatient />
          </v-sheet>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>

import DepartmentsJs from '../scripts/departments.js'

export default DepartmentsJs
</script>