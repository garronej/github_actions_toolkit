
test('throws invalid number', async () => {
  await expect((()=>{ throw new Error("milliseconds not a number (test ran) wtf"); })()).rejects.toThrow('milliseconds not a number (test ran)')
})
