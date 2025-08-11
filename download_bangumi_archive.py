import requests
import os
import shutil
import zipfile
from tqdm import tqdm
from datetime import datetime

# 固定解压目标文件夹
TARGET_FOLDER = "bangumi_archive"
# 自动化模式标记
AUTO_MODE = True  # 设为True时将自动执行，无需用户交互

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

def download_file(url, save_path):
    """下载文件并显示进度条"""
    try:
        response_head = requests.head(url)
        file_size = int(response_head.headers.get('content-length', 0))
        
        with requests.get(url, stream=True) as response:
            response.raise_for_status()
            
            with open(save_path, 'wb') as file, tqdm(
                desc=os.path.basename(save_path),
                total=file_size,
                unit='iB',
                unit_scale=True,
                unit_divisor=1024,
            ) as progress_bar:
                for data in response.iter_content(chunk_size=1024*16):
                    size = file.write(data)
                    progress_bar.update(size)
        
        print(f"文件已成功下载至: {save_path}")
        return True
        
    except Exception as e:
        print(f"下载文件时出错: {str(e)}")
        if os.path.exists(save_path):
            os.remove(save_path)
        return False

def extract_zip(zip_path):
    """解压ZIP文件到目标文件夹，完全覆盖原有内容"""
    try:
        os.makedirs(TARGET_FOLDER, exist_ok=True)
        
        # 清空目标文件夹
        if os.listdir(TARGET_FOLDER):
            print(f"清空目标文件夹: {TARGET_FOLDER}")
            for item in os.listdir(TARGET_FOLDER):
                item_path = os.path.join(TARGET_FOLDER, item)
                if os.path.isfile(item_path) or os.path.islink(item_path):
                    os.unlink(item_path)
                else:
                    shutil.rmtree(item_path)
        
        # 解压文件
        print(f"正在解压到 {TARGET_FOLDER}...")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            file_list = zip_ref.namelist()
            total_files = len(file_list)
            
            with tqdm(total=total_files, desc="解压进度") as pbar:
                for file in file_list:
                    zip_ref.extract(file, TARGET_FOLDER)
                    pbar.update(1)
        
        print(f"文件已成功解压至: {os.path.abspath(TARGET_FOLDER)}")
        return True
        
    except zipfile.BadZipFile:
        print("错误: 下载的文件不是有效的ZIP压缩包")
        return False
    except Exception as e:
        print(f"解压文件时出错: {str(e)}")
        return False

def main():
    print("Bangumi Archive 下载器")
    print("======================")
    
    latest_info = get_latest_info()
    if not latest_info:
        print("无法获取最新文件信息，程序退出")
        return
    
    file_name = latest_info.get('name', '未知文件名')
    file_size = latest_info.get('size', 0)
    created_at = format_date(latest_info.get('created_at', '未知时间'))
    download_url = latest_info.get('browser_download_url')
    
    print(f"最新文件: {file_name}")
    print(f"文件大小: {format_size(file_size)}")
    print(f"创建时间: {created_at}")
    
    if not download_url:
        print("未找到下载链接")
        return
    
    save_path = os.path.join(os.getcwd(), file_name)
    file_exists = os.path.exists(save_path)
    
    # 自动化模式处理
    if AUTO_MODE:
        # 自动下载（无论是否存在）
        print("\n自动化模式: 开始下载文件...")
        if not download_file(download_url, save_path):
            return
    else:
        # 交互模式处理
        if file_exists:
            overwrite = input(f"\n文件 {file_name} 已存在，是否覆盖? (y/n): ").lower()
            if overwrite != 'y':
                print("将使用已存在的文件进行解压")
            else:
                if not download_file(download_url, save_path):
                    return
        else:
            confirm = input("\n是否下载该文件? (y/n): ").lower()
            if confirm != 'y':
                print("已取消下载")
                return
            if not download_file(download_url, save_path):
                return
    
    # 检查是否为ZIP文件并解压
    if file_name.endswith('.zip'):
        extract_zip(save_path)
        
        # 自动化模式下自动删除压缩包
        if AUTO_MODE:
            os.remove(save_path)
            print(f"已自动删除压缩包: {file_name}")
        else:
            if input("\n是否删除下载的压缩包? (y/n): ").lower() == 'y':
                os.remove(save_path)
                print(f"已删除压缩包: {file_name}")
    else:
        print("下载的文件不是ZIP格式，无需解压")

if __name__ == "__main__":
    main()
    
