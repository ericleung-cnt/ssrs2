package migration;

import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.imageio.ImageIO;

import org.apache.commons.io.IOUtils;
import org.mardep.ssrs.vitaldoc.IVitalDocClient;

import net.sf.image4j.util.ConvertUtil;

public class SeafarerImages {

	IVitalDocClient vd;

	public SeafarerImages(IVitalDocClient vd) {
		this.vd = vd;
	}

	private byte[] read(Blob blob) throws IOException, SQLException {
		byte[] bytes = new byte[0];
		if (blob != null) {
			try (InputStream in = blob.getBinaryStream()) {
				bytes = IOUtils.toByteArray(in);
			}
		}
		return bytes;
	}

	public void read(String driverClass, String orclUrl, String orclUser, String orclPwd) throws SQLException,
			InstantiationException, IllegalAccessException, ClassNotFoundException, IOException, FileNotFoundException {
		DriverManager.registerDriver((Driver) Class.forName(driverClass).newInstance());
		try (Connection oracle = DriverManager.getConnection(orclUrl, orclUser, orclPwd)) {
			try (PreparedStatement statement = oracle.prepareStatement("select SERB_NO, FINGER_IMAGE_LEFT, "
					+ "REMARK, FINGER_IMAGE_RIGHT, FACE_PHOTO, SIDE_PHOTO, FINGER_FLAG " + "from SEAFARER_IMAGE")) {
				try (ResultSet resultSet = statement.executeQuery()) {
					try (FileWriter w = new FileWriter("out/files.txt")) {
						int i = 1;
						while (resultSet.next()) {
							String serb = resultSet.getString(1);
							byte[] leftGif = read(resultSet.getBlob(2));
							byte[] left = new byte[0];
							if (leftGif != null) {
								ByteArrayOutputStream bmp = writeBmp(leftGif, "out/" + serb + "_left");
								if (bmp != null) {
									left = bmp.toByteArray();
								}
							}

							String remark = resultSet.getString(3);
							byte[] righGif = read(resultSet.getBlob(4));
							byte[] right = new byte[0];
							if (righGif != null) {
								ByteArrayOutputStream bmp = writeBmp(righGif, "out/" + serb + "_right");
								if (bmp != null) {
									right = bmp.toByteArray();
								}
							}
							String face = resultSet.getString(5);
							String side = resultSet.getString(6);
							String fingerFlag = resultSet.getString(7);

							if ("Y".equals(fingerFlag)) {
								// replace(serb, IVitalDocClient.INDEX_LEFT,
								// left);
								// replace(serb, IVitalDocClient.INDEX_RIGHT,
								// right);
							}
							if (face != null) {
								// replace(serb, IVitalDocClient.INDEX_FRONT,
								// new byte[0]); // TODO
							}
							if (side != null) {
								// replace(serb, IVitalDocClient.INDEX_FRONT,
								// new byte[0]); // TODO
							}
							w.write(i + "," + serb + "," + remark + "," + left.length + "," + right.length + "," + face
									+ "," + side + "," + fingerFlag + "\r\n");
							i++;
						}
					}
				}
			}

		}
	}

	private ByteArrayOutputStream writeBmp(byte[] bytes, String filename) throws IOException, FileNotFoundException {
		if (bytes != null && bytes.length > 0) {
			BufferedImage bi = ImageIO.read(new ByteArrayInputStream(bytes));
			if (bi == null) {
				System.out.println("write fail " + filename);
			} else {
				bi = ConvertUtil.convert24(bi);

				BufferedImage large = new BufferedImage(500, 500, BufferedImage.TYPE_BYTE_BINARY);
				Graphics g = large.getGraphics();
				g.drawImage(bi, (500 - bi.getWidth()) / 2, (500 - bi.getHeight()) / 2, null);
				bi = large;

				ByteArrayOutputStream baos = new ByteArrayOutputStream();
				ImageIO.write(bi, "bmp", baos);
				// header length 62 ,content 32000, bytes per line = 64, size =
				// 64* 500 + 62 = 32062,
				// 1 bits per pixel
				try (FileOutputStream fos = new FileOutputStream(filename + ".bmp")) {
					fos.write(baos.toByteArray());
				}
				return baos;

			}
		}
		return null;
	}

	public void replace(String serb, int type, byte[] content) throws IOException {
		String key = "SERB_"+serb;
		vd.uploadSeafarerImage(key, type, content, null);
	}
	public byte[] bmpToPixel(InputStream in) throws IOException {
		byte[] fp = new byte[250000];
		byte[] header = new byte[62];
		IOUtils.read(in, header);
		byte[] content = org.apache.poi.util.IOUtils.toByteArray(in); // length 32000

		for (int x = 0; x < 500; x++) {
			for (int y = 0; y < 500; y++) {
				int index = x * 64 + y / 8;
				byte b = content[index];
				String s1 = String.format("%8s", Integer.toBinaryString(b & 0xFF)).replace(' ', '0');
				char bit = s1.charAt(y % 8);
				int pt = (499 - x) * 500 + y;
				fp[ pt] = (byte)(bit == '0' ? 0 : -1);
			}
		}
		return fp;
	}

}
