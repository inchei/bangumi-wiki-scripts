import requests
import os
import hashlib
import shutil
from tqdm import tqdm
from datetime import datetime
import zipfile

def get_latest_info():
    """从aux/latest.json获取最新导出文件信息"""
    latest_json_url = "https://raw.githubusercontent.com/bangumi/Archive/master/aux/latest.json"
    
    try:
        response = requests.get(latest_json_url)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"获取最新信息失败: {str(e)}")
        return None

def format_size(size_bytes):
    """将字节大小转换为人类可读的格式"""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.2f} KB"
    elif size_bytes < 1024 * 1024 * 1024:
        return f"{size_bytes / (1024 * 1024):.2f} MB"
    else:
        return f"{size_bytes / (1024 * 1024 * 1024):.2f} GB"

def format_date(date_str):
    """格式化日期显示"""
    try:
        dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        return dt.astimezone().strftime("%Y-%m-%d %H:%M:%S")
    except:
        return date_str

def calculate_sha256(file_path):
    """计算文件的SHA256哈希值"""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def verify_file(file_path, digest):
    """使用digest验证文件完整性"""
    if not digest:
        print("没有提供校验信息，无法验证文件完整性")
        return True
        
    # 提取纯哈希值（去除"sha256:"前缀）
    if digest.startswith('sha256:'):
        expected_hash = digest[7:]
    else:
        expected_hash = digest
        
    print("正在验证文件完整性...")
    file_hash = calculate_sha256(file_path)
    
    if file_hash == expected_hash:
        print("文件完整性验证成功")
        return True
    else:
        print(f"文件验证失败！")
        print(f"预期哈希: {expected_hash[:16]}...")
        print(f"实际哈希: {file_hash[:16]}...")
        return False

def extract_zip(file_path):
    """解压ZIP文件到同名文件夹"""
    # 创建与ZIP文件同名的文件夹
    extract_dir = os.path.splitext(file_path)[0]
    
    # 如果文件夹已存在，询问是否覆盖
    if os.path.exists(extract_dir):
        print(f"解压目录 '{extract_dir}' 已存在")
        overwrite = input("是否删除现有目录并重新解压? (y/n): ").lower()
        if overwrite != 'y':
            print("取消解压")
            return False
        try:
            shutil.rmtree(extract_dir)
            print("已删除现有目录")
        except Exception as e:
            print(f"删除现有目录失败: {str(e)}")
            return False
    
    # 创建解压目录
    os.makedirs(extract_dir, exist_ok=True)
    
    try:
        # 打开ZIP文件
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            # 获取所有文件列表
            file_list = zip_ref.namelist()
            total_files = len(file_list)
            
            print(f"开始解压 {total_files} 个文件到 '{extract_dir}'...")
            
            # 逐个解压文件并显示进度
            for i, file in enumerate(file_list, 1):
                # 显示当前解压进度
                print(f"\r解压中: {i}/{total_files} ({file.split('/')[-1]})", end='', flush=True)
                zip_ref.extract(file, extract_dir)
            
            print("\n解压完成")
            return True
            
    except zipfile.BadZipFile:
        print("错误：ZIP文件损坏或无效")
    except zipfile.LargeZipFile:
        print("错误：ZIP文件过大，需要启用ZIP64支持")
    except Exception as e:
        print(f"解压失败: {str(e)}")
    return False

def download_file(url, save_path, expected_size):
    """带断点续传和大小验证的文件下载"""
    temp_path = f"{save_path}.part"
    downloaded_size = 0
    
    # 检查是否有部分下载的文件
    if os.path.exists(temp_path):
        downloaded_size = os.path.getsize(temp_path)
        if downloaded_size >= expected_size:
            os.rename(temp_path, save_path)
            return True
            
        print(f"发现部分下载的文件，将从 {format_size(downloaded_size)} 继续下载...")

    try:
        headers = {}
        if downloaded_size > 0:
            headers['Range'] = f'bytes={downloaded_size}-'
            
        with requests.get(url, stream=True, headers=headers) as response:
            response.raise_for_status()
            
            # 获取本次下载的大小
            content_length = int(response.headers.get('content-length', 0))
            total_size = downloaded_size + content_length
            
            # 验证总大小是否匹配预期
            if expected_size and total_size != expected_size:
                print(f"警告：文件大小不匹配，预期: {format_size(expected_size)}，实际: {format_size(total_size)}")
                # 差异超过1MB则重新下载
                if abs(total_size - expected_size) > 1024 * 1024:
                    print("差异过大，将重新下载整个文件")
                    if os.path.exists(temp_path):
                        os.remove(temp_path)
                    return download_file(url, save_path, expected_size)
            
            # 写入文件
            with open(temp_path, 'ab') as file, tqdm(
                desc=os.path.basename(save_path),
                total=expected_size,
                initial=downloaded_size,
                unit='iB',
                unit_scale=True,
                unit_divisor=1024,
            ) as progress_bar:
                for data in response.iter_content(chunk_size=1024*16):
                    if data:
                        size = file.write(data)
                        progress_bar.update(size)
        
        # 验证最终文件大小
        final_size = os.path.getsize(temp_path)
        if expected_size and final_size != expected_size:
            print(f"下载不完整！预期: {format_size(expected_size)}，实际: {format_size(final_size)}")
            print("将尝试重新下载...")
            return download_file(url, save_path, expected_size)
        
        # 下载完成，重命名临时文件
        os.rename(temp_path, save_path)
        print(f"文件已成功下载至: {save_path}")
        return True
        
    except Exception as e:
        print(f"下载过程出错: {str(e)}")
        print(f"已下载 {format_size(downloaded_size)}，可重新运行脚本继续下载")
        return False

def main():
    print("Bangumi Archive 最新版本下载器")
    print("==========================")
    
    # 获取最新导出文件信息
    latest_info = get_latest_info()
    if not latest_info:
        print("无法获取最新文件信息，程序退出")
        return
    
    # 提取文件信息
    file_name = latest_info.get('name', '未知文件名')
    file_size = latest_info.get('size', 0)
    created_at = format_date(latest_info.get('created_at', '未知时间'))
    download_url = latest_info.get('browser_download_url')
    digest = latest_info.get('digest')  # 这是SHA256哈希值
    
    print(f"最新文件: {file_name}")
    print(f"文件大小: {format_size(file_size)}")
    print(f"创建时间: {created_at}")
    print(f"校验方式: {digest.split(':')[0] if digest else '无'}")
    
    if not download_url:
        print("未找到下载链接")
        return
    
    # 准备保存路径
    save_path = os.path.join(os.getcwd(), file_name)
    
    # 检查文件是否已存在且完整
    if os.path.exists(save_path):
        current_size = os.path.getsize(save_path)
        if current_size == file_size:
            print(f"\n文件 {file_name} 已存在且大小匹配")
            if verify_file(save_path, digest):
                print("文件完整可用")
                # 询问是否需要解压
                extract = input("是否需要解压该文件? (y/n): ").lower()
                if extract == 'y':
                    extract_zip(save_path)
                return
            else:
                print("但文件可能已损坏，将重新下载")
        else:
            print(f"\n文件 {file_name} 已存在但不完整 (当前: {format_size(current_size)})")
            overwrite = input("是否重新下载? (y/n): ").lower()
            if overwrite != 'y':
                print("已取消下载")
                return
    
    # 开始下载
    print(f"\n准备下载: {file_name}")
    if download_file(download_url, save_path, file_size):
        # 下载完成后验证
        if verify_file(save_path, digest):
            # 自动解压
            print("\n下载验证成功，准备解压文件...")
            extract_zip(save_path)
        else:
            print("文件验证失败，不进行解压")

if __name__ == "__main__":
    main()
