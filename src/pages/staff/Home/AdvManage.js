// src/components/BannerTable.jsx
import React from 'react';

const BannerTable = () => {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        {/* <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3">
          <div className="flex items-center gap-4 text-[#111418]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">Advertise.io</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#111418] text-sm font-medium leading-normal" href="#">Dashboard</a>
              <a className="text-[#111418] text-sm font-medium leading-normal" href="#">Campaigns</a>
              <a className="text-[#111418] text-sm font-medium leading-normal" href="#">Audiences</a>
              <a className="text-[#111418] text-sm font-medium leading-normal" href="#">Reports</a>
              <a className="text-[#111418] text-sm font-medium leading-normal" href="#">Insights</a>
            </div>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#3289e7] text-white text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">New campaign</span>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/stability/12266c0a-ebec-4be8-ba55-d2405912f872.png")' }}
            ></div>
          </div>
        </header> */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">Banners</p>
            </div>
            <div className="pb-3">
              <div className="flex border-b border-[#dce0e5] px-4 gap-8">
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-[#111418] text-[#111418] pb-[13px] pt-4" href="#">
                  <p className="text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]">All</p>
                </a>
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#637588] pb-[13px] pt-4" href="#">
                  <p className="text-[#637588] text-sm font-bold leading-normal tracking-[0.015em]">Active</p>
                </a>
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#637588] pb-[13px] pt-4" href="#">
                  <p className="text-[#637588] text-sm font-bold leading-normal tracking-[0.015em]">Paused</p>
                </a>
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#637588] pb-[13px] pt-4" href="#">
                  <p className="text-[#637588] text-sm font-bold leading-normal tracking-[0.015em]">Archived</p>
                </a>
              </div>
            </div>
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div className="text-[#637588] flex border-none bg-[#f0f2f4] items-center justify-center pl-4 rounded-l-xl border-r-0" data-icon="MagnifyingGlass" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  </div>
                  <input
                    placeholder="Search by name or ID"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-full placeholder:text-[#637588] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                    value=""
                  />
                </div>
              </label>
            </div>
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]">
                  <span className="truncate">Bulk actions</span>
                </button>
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#3289e7] text-white text-sm font-bold leading-normal tracking-[0.015em]">
                  <span className="truncate">Add banner</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse block md:table">
                  <thead className="block md:table-header-group">
                    <tr className="border border-solid border-[#dce0e5] flex md:table-row flex-col md:flex-row mb-2 md:mb-0">
                      <th className="p-4 text-[#111418] text-left md:border md:border-solid md:border-[#dce0e5] block md:table-cell">ID</th>
                      <th className="p-4 text-[#111418] text-left md:border md:border-solid md:border-[#dce0e5] block md:table-cell">Banner Image</th>
                      <th className="p-4 text-[#111418] text-left md:border md:border-solid md:border-[#dce0e5] block md:table-cell">Forward Link</th>
                      <th className="p-4 text-[#111418] text-left md:border md:border-solid md:border-[#dce0e5] block md:table-cell">Admin ID</th>
                      <th className="p-4 text-[#111418] text-left md:border md:border-solid md:border-[#dce0e5] block md:table-cell">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="block md:table-row-group">
                    <tr className="border border-solid border-[#dce0e5] flex md:table-row flex-col md:flex-row mb-2 md:mb-0">
                      <td className="p-4 text-[#111418] text-left md:border md:border-solid md:border-[#dce0e5] block md:table-cell">1</td>
                      <td className="p-4 text-[#111418] text-left md:border md:border-solid md:border-[#dce0e5] block md:table-cell">
                        <img src="https://via.placeholder.com/150" alt="Banner" className="w-16 h-16 object-cover" />
                      </td>
                      <td className="p-4 text-[#111418] text-left md:border md:border-solid md:border-[#dce0e5] block md:table-cell">http://example.com</td>
                      <td className="p-4 text-[#111418] text-left md:border md:border-solid md:border-[#dce0e5] block md:table-cell">Admin123</td>
                      <td className="p-4 text-[#111418] text-left md:border md:border-solid md:border-[#dce0e5] block md:table-cell">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#3289e7] text-white text-sm font-bold leading-normal tracking-[0.015em]">
                          <span className="truncate">View details</span>
                        </button>
                      </td>
                    </tr>
                    {/* More rows as needed */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerTable;
