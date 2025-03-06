export default function BuilderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='border-border-gray-200 mx-auto min-h-dvh max-w-[40rem] border-x'>
      {children}
    </div>
  );
}
