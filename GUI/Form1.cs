using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Runtime.InteropServices;
using System.IO;

namespace GUI {
    public partial class Form1 : Form {
        public Form1 () {
            InitializeComponent();
            this.offsetCount = 0;
            InitMMF();
        }

        private unsafe void InitMMF () {
            // Allocate a block of unmanaged memory and return an IntPtr object.	
            IntPtr memIntPtr = Marshal.AllocHGlobal(WORD_OFFSET * 4 * 2);

            // Get a byte pointer from the IntPtr object.
            this.generatorMemPtr = (byte*) memIntPtr.ToPointer();

            // Get another for the lagger
            this.readerMemPtr = (byte*) memIntPtr.ToPointer();

            // Save start for freeing mem on exit
            this.beginPtr = (byte*) memIntPtr.ToPointer();
        }

        private unsafe void button1_Click (object sender, EventArgs e) {
            // Free the block of unmanaged memory.
            Marshal.FreeHGlobal((IntPtr) this.beginPtr);
            Application.Exit();
        }

        private void textBox1_TextChanged (object sender, EventArgs e) {

        }

        private void textBox1_TextChanged_1 (object sender, EventArgs e) {

        }

        private void Form1_Load (object sender, EventArgs e) {

        }

        private void Form1_MouseMove (object sender, MouseEventArgs e) {
            // label1.Text = Cursor.Position.ToString();
            label1.Text = e.Location.ToString();
            testWriter(e.Location.X, e.Location.Y);
        }

        private unsafe void testWriter (int x, int y) {
            // Create some data to read and write.
            UInt16 xCoord = (UInt16) x;
            UInt16 yCoord = (UInt16) y;
            byte[] message = new byte[4];
            message[0] = (byte) (xCoord >> 8);
            message[1] = (byte) xCoord;
            message[2] = (byte) (yCoord >> 8);
            message[3] = (byte) yCoord;


            //byte[] message = UnicodeEncoding.Unicode.GetBytes(x + " " + y);

            // Create an UnmanagedMemoryStream object using a pointer to unmanaged memory.
            UnmanagedMemoryStream writeStream = new UnmanagedMemoryStream(this.generatorMemPtr, message.Length, message.Length, FileAccess.Write);
            // Write the data.
            writeStream.Write(message, 0, message.Length);

            // Close the stream.
            writeStream.Close();

            if (this.offsetCount >= WORD_OFFSET) {
                // Create another UnmanagedMemoryStream object using a pointer to unmanaged memory.
                UnmanagedMemoryStream readStream = new UnmanagedMemoryStream(this.readerMemPtr, message.Length, message.Length, FileAccess.Read);

                // Create a byte array to hold data from unmanaged memory.
                byte[] outMessage = new byte[message.Length];

                // Read from unmanaged memory to the byte array.
                readStream.Read(outMessage, 0, message.Length);

                // Close the stream.
                readStream.Close();

                // Display the data to the console.
                UInt16 readX = (UInt16) outMessage[0];
                readX = ((ushort) (readX << 8));
                readX |= (UInt16) outMessage[1];

                UInt16 readY = (UInt16) outMessage[2];
                readY = ((ushort) (readY << 8));
                readY |= (UInt16) outMessage[3];
                label2.Text = "" + readX + ", " + readY;
                this.readerMemPtr += 32;
            }

            if (this.offsetCount < WORD_OFFSET) offsetCount++;

            this.generatorMemPtr += 32;

            if (this.generatorMemPtr >= this.beginPtr + (WORD_OFFSET * 4 * 2 * 8)) {
                this.generatorMemPtr = this.beginPtr;
            }
            
            if (this.readerMemPtr >= this.beginPtr + (WORD_OFFSET * 4 * 2 * 8)) {
                this.readerMemPtr = this.beginPtr;
            }
        }
    }
}
